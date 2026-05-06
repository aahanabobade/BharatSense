"""
BharatSense — M01 Crop & Soil Advisor
FastAPI backend with real Open-Meteo data + RF/XGBoost models.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
import numpy as np
import joblib
import os
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBRegressor

# ─────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────
app = FastAPI(
    title="BharatSense M01 — Crop & Soil Advisor",
    description="Predicts irrigation need 72h ahead and yield outlook for Indian farms.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Domain config
# ─────────────────────────────────────────────
CROP_CONFIG = {
    "wheat":     {"et_multiplier": 1.0,  "label": "Wheat"},
    "rice":      {"et_multiplier": 1.3,  "label": "Rice"},
    "tomato":    {"et_multiplier": 1.1,  "label": "Tomato"},
    "cotton":    {"et_multiplier": 0.9,  "label": "Cotton"},
    "sugarcane": {"et_multiplier": 1.4,  "label": "Sugarcane"},
    "maize":     {"et_multiplier": 1.0,  "label": "Maize"},
    "soybean":   {"et_multiplier": 0.95, "label": "Soybean"},
    "potato":    {"et_multiplier": 1.1,  "label": "Potato"},
}

GROWTH_STAGES = {
    "seedling":   0.40,
    "vegetative": 0.80,
    "flowering":  1.15,
    "fruiting":   1.10,
    "maturity":   0.75,
}

FEATURE_NAMES = [
    "soil_moisture_pct",
    "et_rate_mm_day",
    "rain_24h_mm",
    "rain_48h_mm",
    "rain_72h_mm",
    "temperature_c",
    "humidity_pct",
    "crop_code",
    "growth_stage_code",
]

# ─────────────────────────────────────────────
# Model training (synthetic agronomic data)
# ─────────────────────────────────────────────
RF_PATH  = "m01_rf_model.pkl"
XGB_PATH = "m01_xgb_model.pkl"

rf_model  = None
xgb_model = None


def _generate_training_data(n: int = 8000):
    """
    Synthetic dataset based on standard agronomic decision rules.
    Labels are deterministic rules + 5% noise for realism.
    """
    rng = np.random.default_rng(42)

    soil  = rng.uniform(10, 85, n)          # % volumetric
    et    = rng.uniform(1, 9, n)            # mm/day
    r24   = rng.exponential(3, n)           # mm
    r48   = r24 + rng.exponential(2, n)
    r72   = r48 + rng.exponential(2, n)
    temp  = rng.uniform(15, 46, n)
    hum   = rng.uniform(20, 95, n)
    crop  = rng.integers(0, len(CROP_CONFIG), n)
    stage = rng.integers(0, len(GROWTH_STAGES), n)

    et_mult = np.array([v["et_multiplier"] for v in CROP_CONFIG.values()])
    kc_vals = np.array(list(GROWTH_STAGES.values()))
    eff_et  = et * et_mult[crop] * kc_vals[stage]

    # Irrigation trigger rules
    low_soil    = soil < 35
    stress_mild = (soil < 52) & (eff_et - r24 * 0.7 > 3)
    stress_high = (soil < 65) & (eff_et - r72 * 0.7 > 5)
    y = (low_soil | stress_mild | stress_high).astype(int)

    # 5 % label noise
    flip = rng.choice(n, int(n * 0.05), replace=False)
    y[flip] = 1 - y[flip]

    X = np.column_stack([soil, et, r24, r48, r72, temp, hum, crop, stage])
    return X, y, eff_et


def train_and_save():
    global rf_model, xgb_model
    print("Training M01 models …")
    X, y_irr, eff_et = _generate_training_data()

    rf_model = RandomForestClassifier(
        n_estimators=150, max_depth=10, min_samples_leaf=5,
        random_state=42, n_jobs=-1
    )
    rf_model.fit(X, y_irr)

    # XGBoost predicts water-stress index (effective ET excess)
    xgb_model = XGBRegressor(
        n_estimators=150, max_depth=6, learning_rate=0.05,
        random_state=42, verbosity=0
    )
    xgb_model.fit(X, eff_et)

    joblib.dump(rf_model,  RF_PATH)
    joblib.dump(xgb_model, XGB_PATH)
    print("Models saved.")


@app.on_event("startup")
async def startup():
    global rf_model, xgb_model
    if os.path.exists(RF_PATH) and os.path.exists(XGB_PATH):
        rf_model  = joblib.load(RF_PATH)
        xgb_model = joblib.load(XGB_PATH)
        print("M01 models loaded from disk.")
    else:
        train_and_save()


# ─────────────────────────────────────────────
# Open-Meteo fetcher
# ─────────────────────────────────────────────
async def fetch_open_meteo(lat: float, lon: float) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude":  lat,
        "longitude": lon,
        "hourly": (
            "temperature_2m,relative_humidity_2m,"
            "precipitation,precipitation_probability,"
            "evapotranspiration,soil_moisture_3_to_9cm"
        ),
        "daily": (
            "precipitation_sum,"
            "et0_fao_evapotranspiration,"
            "precipitation_probability_max,"
            "temperature_2m_max,temperature_2m_min"
        ),
        "timezone":      "Asia/Kolkata",
        "forecast_days": 4,
    }
    async with httpx.AsyncClient(timeout=12) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


def _safe_mean(lst, fallback=0.0):
    vals = [v for v in lst if v is not None]
    return float(np.mean(vals)) if vals else fallback


def _safe_sum(lst, fallback=0.0):
    vals = [v for v in lst if v is not None]
    return float(np.sum(vals)) if vals else fallback


# ─────────────────────────────────────────────
# Prediction helpers
# ─────────────────────────────────────────────
def _best_irrigation_window(hourly_temps: list) -> str:
    """Return the coolest 2-hour window in the next 36 hours."""
    temps = [t if t is not None else 999 for t in hourly_temps[:36]]
    best  = int(np.argmin(temps))
    hour  = best % 24
    # Prefer early morning slots
    if not (4 <= hour <= 8):
        hour = 5
    return f"{hour:02d}:00 – {hour + 2:02d}:00"

def _yield_score(et_rate, kc, et_mult, rain_72h, soil_pct) -> float:
    eff_et   = et_rate * kc * et_mult
    water_in = rain_72h * 0.7 + (soil_pct / 100) * 45
    deficit  = max(0.0, eff_et - water_in)
    score    = max(0.0, min(100.0, 100 - deficit * 8))  # was * 6
    # If soil is critically dry, cap the score
    if soil_pct < 30:
        score = min(score, 45.0)
    elif soil_pct < 45:
        score = min(score, 70.0)
    return round(score, 1)


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────
@app.get("/m01/crops", summary="List supported crops and growth stages")
def list_crops():
    return {
        "crops":         list(CROP_CONFIG.keys()),
        "growth_stages": list(GROWTH_STAGES.keys()),
    }


@app.get("/m01/predict", summary="Get irrigation & yield prediction")
async def predict(
    lat:           float = Query(...,          description="Latitude (e.g. 19.076)"),
    lon:           float = Query(...,          description="Longitude (e.g. 72.877)"),
    crop:          str   = Query("wheat",      description="Crop type"),
    growth_stage:  str   = Query("vegetative", description="Current growth stage"),
    location_name: str   = Query("Your Farm",  description="Human-readable location"),
):
    # Validate inputs
    if crop not in CROP_CONFIG:
        raise HTTPException(400, f"Unsupported crop. Choose from: {list(CROP_CONFIG.keys())}")
    if growth_stage not in GROWTH_STAGES:
        raise HTTPException(400, f"Unsupported stage. Choose from: {list(GROWTH_STAGES.keys())}")

    # Fetch real weather
    try:
        wx = await fetch_open_meteo(lat, lon)
    except Exception as e:
        raise HTTPException(503, f"Weather API unavailable: {str(e)}")

    hourly = wx["hourly"]
    daily  = wx["daily"]

    # ── Parse weather ──
    # Soil moisture: API returns m³/m³ fraction → multiply by 100 for %
    sm_raw          = hourly.get("soil_moisture_3_to_9cm", [])
    soil_pct        = _safe_mean(sm_raw[:12], fallback=40.0) * 100

    rain_daily      = [v or 0 for v in daily.get("precipitation_sum", [])]
    rain_24h        = rain_daily[0] if len(rain_daily) > 0 else 0.0
    rain_48h        = sum(rain_daily[:2]) if len(rain_daily) >= 2 else rain_24h
    rain_72h        = sum(rain_daily[:3]) if len(rain_daily) >= 3 else rain_48h

    et_daily        = [v for v in daily.get("et0_fao_evapotranspiration", []) if v is not None]
    et_rate         = et_daily[0] if et_daily else 4.0

    temp_hourly     = hourly.get("temperature_2m", [])
    current_temp    = _safe_mean(temp_hourly[:8], fallback=30.0)

    hum_hourly      = hourly.get("relative_humidity_2m", [])
    current_hum     = _safe_mean(hum_hourly[:8], fallback=60.0)

    # ── Feature vector ──
    crop_code  = list(CROP_CONFIG.keys()).index(crop)
    stage_code = list(GROWTH_STAGES.keys()).index(growth_stage)

    X = np.array([[soil_pct, et_rate, rain_24h, rain_48h, rain_72h,
                   current_temp, current_hum, crop_code, stage_code]])

    # ── Predictions ──
    irr_needed  = bool(rf_model.predict(X)[0])
    irr_prob    = float(rf_model.predict_proba(X)[0][1])
    stress_idx  = float(xgb_model.predict(X)[0])

    kc          = GROWTH_STAGES[growth_stage]
    et_mult     = CROP_CONFIG[crop]["et_multiplier"]
    yscore      = _yield_score(et_rate, kc, et_mult, rain_72h, soil_pct)

    irr_window  = _best_irrigation_window(temp_hourly) if irr_needed else None

    # ── Soil status label ──
    if soil_pct < 30:
        soil_status = "Critical — very dry"
    elif soil_pct < 45:
        soil_status = "Low — irrigation recommended"
    elif soil_pct < 65:
        soil_status = "Adequate"
    else:
        soil_status = "High — waterlogging risk"

    # ── Yield outlook ──
    yield_outlook = "Good" if yscore > 75 else "Moderate" if yscore > 50 else "Poor"

    # ── SMS alert ──
    if irr_needed:
        sms = (
            f"BharatSense M01 | {location_name} | "
            f"{CROP_CONFIG[crop]['label']} ({growth_stage}): "
            f"Irrigation needed. Soil={soil_pct:.0f}%. "
            f"Best window: {irr_window}. "
            f"Rain in 72h: {rain_72h:.0f}mm. Confidence: {irr_prob*100:.0f}%."
        )
    else:
        sms = (
            f"BharatSense M01 | {location_name} | "
            f"{CROP_CONFIG[crop]['label']} ({growth_stage}): "
            f"No irrigation needed. Soil={soil_pct:.0f}%. "
            f"Rain in 72h: {rain_72h:.0f}mm. Check again in 3 days."
        )

    return {
        "module":    "M01",
        "location":  location_name,
        "crop":      crop,
        "crop_label": CROP_CONFIG[crop]["label"],
        "growth_stage": growth_stage,
        "timestamp": datetime.now().isoformat(),
        "prediction": {
            "irrigation_needed": irr_needed,
            "confidence_pct":    round(irr_prob * 100, 1),
            "irrigation_window": irr_window,
        },
        "soil": {
            "moisture_pct": round(soil_pct, 1),
            "status":       soil_status,
        },
        "weather": {
            "temperature_c":   round(current_temp, 1),
            "humidity_pct":    round(current_hum, 1),
            "rain_24h_mm":     round(rain_24h, 1),
            "rain_48h_mm":     round(rain_48h, 1),
            "rain_72h_mm":     round(rain_72h, 1),
            "et_rate_mm_day":  round(et_rate, 2),
        },
        "yield": {
            "score":              yscore,
            "outlook":            yield_outlook,
            "water_stress_index": round(max(0, stress_idx), 2),
        },
        "sms_alert": sms,
    }


@app.get("/health")
def health():
    return {
        "status":       "ok",
        "module":       "M01",
        "models_ready": rf_model is not None and xgb_model is not None,
    }