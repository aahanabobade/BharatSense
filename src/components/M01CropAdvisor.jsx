

import { useState, useCallback } from "react";

// ─── Config ──────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CROPS = ["wheat", "rice", "tomato", "cotton", "sugarcane", "maize", "soybean", "potato"];
const STAGES = ["seedling", "vegetative", "flowering", "fruiting", "maturity"];

// Popular Indian farm locations
const QUICK_LOCATIONS = [
  { name: "Nashik", lat: 19.9975, lon: 73.7898 },
  { name: "Amravati", lat: 20.9374, lon: 77.7796 },
  { name: "Ludhiana", lat: 30.9010, lon: 75.8573 },
  { name: "Guntur", lat: 16.3067, lon: 80.4365 },
  { name: "Warangal", lat: 17.9784, lon: 79.5941 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, unit, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 12,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 26, fontWeight: 700, color: accent ? "#4ade80" : "#f9fafb", fontFamily: "'DM Mono', monospace" }}>
        {value}
        {unit && <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 4 }}>{unit}</span>}
      </span>
      {sub && <span style={{ fontSize: 12, color: "#6b7280" }}>{sub}</span>}
    </div>
  );
}

function WeatherRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9ca3af" }}>
        <span style={{ fontSize: 16 }}>{icon}</span> {label}
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#e5e7eb" }}>{value}</span>
    </div>
  );
}

function IrrigationBadge({ needed, confidence, window: win }) {
  const color  = needed ? "#f87171" : "#4ade80";
  const bg     = needed ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.1)";
  const border = needed ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)";
  const icon   = needed ? "💧" : "✅";
  const label  = needed ? "Irrigation Needed" : "No Irrigation Needed";

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 16,
      padding: "24px 28px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: "#9ca3af" }}>
        Confidence: <strong style={{ color: "#e5e7eb" }}>{confidence}%</strong>
      </div>
      {win && (
        <div style={{
          marginTop: 14,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 8,
          padding: "10px 14px",
          display: "inline-block",
        }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Best window · </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#fbbf24" }}>{win}</span>
        </div>
      )}
    </div>
  );
}

function YieldBar({ score, outlook }) {
  const color = score > 75 ? "#4ade80" : score > 50 ? "#fbbf24" : "#f87171";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>Yield Outlook</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{outlook}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99,
          transition: "width 1s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: "#4b5563" }}>0</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color }}>Score: {score}/100</span>
      </div>
    </div>
  );
}

function SMSAlert({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      background: "rgba(251,191,36,0.06)",
      border: "1px solid rgba(251,191,36,0.2)",
      borderRadius: 12,
      padding: "16px 18px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#fbbf24", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          📱 SMS Alert
        </span>
        <button
          onClick={copy}
          style={{
            background: "rgba(251,191,36,0.15)",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 11,
            color: "#fbbf24",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p style={{ fontSize: 13, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function M01CropAdvisor() {
  const [form, setForm] = useState({
    lat:           "",
    lon:           "",
    location_name: "",
    crop:          "wheat",
    growth_stage:  "vegetative",
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const setQuickLocation = (loc) => {
    setForm(f => ({ ...f, lat: loc.lat, lon: loc.lon, location_name: loc.name }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!form.lat || !form.lon) {
      setError("Please enter or select a location.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        lat:           form.lat,
        lon:           form.lon,
        crop:          form.crop,
        growth_stage:  form.growth_stage,
        location_name: form.location_name || "Your Farm",
      });
      const res = await fetch(`${API_BASE}/m01/predict?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Prediction failed.");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [form]);

  // ── Styles ────────────────────────────────────────────────────────────────
  const S = {
    wrap: {
      minHeight: "100vh",
      background: "#0a0f0a",
      color: "#f9fafb",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    inner: {
      maxWidth: 860,
      margin: "0 auto",
    },
    header: {
      marginBottom: 40,
    },
    badge: {
      display: "inline-block",
      background: "rgba(74,222,128,0.12)",
      border: "1px solid rgba(74,222,128,0.25)",
      color: "#4ade80",
      borderRadius: 99,
      padding: "4px 14px",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.06em",
      marginBottom: 16,
    },
    h1: {
      fontSize: "clamp(28px, 5vw, 42px)",
      fontWeight: 800,
      margin: "0 0 8px",
      background: "linear-gradient(135deg, #f9fafb 40%, #4ade80)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      fontSize: 15,
      color: "#6b7280",
      margin: 0,
    },
    card: {
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18,
      padding: "28px 28px",
      marginBottom: 20,
    },
    label: {
      display: "block",
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 6,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    input: {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "11px 14px",
      color: "#f9fafb",
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      background: "#111a11",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "11px 14px",
      color: "#f9fafb",
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
    },
    sectionTitle: {
      fontSize: 13,
      color: "#6b7280",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 14,
    },
    btn: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #16a34a, #4ade80)",
      border: "none",
      borderRadius: 12,
      color: "#052e16",
      fontWeight: 800,
      fontSize: 15,
      cursor: "pointer",
      letterSpacing: "0.02em",
      transition: "opacity 0.2s",
    },
    quickBtn: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "6px 12px",
      color: "#9ca3af",
      fontSize: 12,
      cursor: "pointer",
      transition: "all 0.15s",
    },
  };

  return (
    <div style={S.wrap}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div style={S.inner}>

        {/* Header */}
        <div style={S.header}>
          <div style={S.badge}>M01 · Agriculture</div>
          <h1 style={S.h1}>Crop & Soil Advisor</h1>
          <p style={S.subtitle}>
            Predicts irrigation need 72 hours ahead · Random Forest + XGBoost · Real Open-Meteo data
          </p>
        </div>

        {/* Input card */}
        <div style={S.card}>
          <p style={S.sectionTitle}>Farm Location</p>

          {/* Quick location buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {QUICK_LOCATIONS.map(loc => (
              <button
                key={loc.name}
                style={{
                  ...S.quickBtn,
                  ...(form.location_name === loc.name ? {
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.3)",
                    color: "#4ade80",
                  } : {}),
                }}
                onClick={() => setQuickLocation(loc)}
              >
                {loc.name}
              </button>
            ))}
          </div>

          {/* Lat / Lon / Name */}
          <div style={{ ...S.grid2, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Latitude</label>
              <input
                style={S.input}
                name="lat"
                type="number"
                step="0.001"
                placeholder="e.g. 19.997"
                value={form.lat}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={S.label}>Longitude</label>
              <input
                style={S.input}
                name="lon"
                type="number"
                step="0.001"
                placeholder="e.g. 73.789"
                value={form.lon}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={S.label}>Location Name (optional)</label>
            <input
              style={S.input}
              name="location_name"
              placeholder="e.g. My Farm, Nashik"
              value={form.location_name}
              onChange={handleChange}
            />
          </div>

          <p style={S.sectionTitle}>Crop Details</p>
          <div style={{ ...S.grid2, marginBottom: 22 }}>
            <div>
              <label style={S.label}>Crop Type</label>
              <select style={S.select} name="crop" value={form.crop} onChange={handleChange}>
                {CROPS.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Growth Stage</label>
              <select style={S.select} name="growth_stage" value={form.growth_stage} onChange={handleChange}>
                {STAGES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Fetching real-time data…" : "Get Prediction →"}
          </button>

          {error && (
            <div style={{
              marginTop: 14,
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#f87171",
              fontSize: 13,
            }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div>
            {/* Timestamp + location */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb" }}>
                📍 {result.location} · {result.crop_label} ({result.growth_stage})
              </span>
              <span style={{ fontSize: 11, color: "#4b5563", fontFamily: "'DM Mono', monospace" }}>
                {new Date(result.timestamp).toLocaleTimeString("en-IN")}
              </span>
            </div>

            {/* Main verdict */}
            <div style={{ marginBottom: 16 }}>
              <IrrigationBadge
                needed={result.prediction.irrigation_needed}
                confidence={result.prediction.confidence_pct}
                window={result.prediction.irrigation_window}
              />
            </div>

            {/* Stat grid */}
            <div style={{ ...S.grid3, marginBottom: 16 }}>
              <StatCard
                label="Soil Moisture"
                value={`${result.soil.moisture_pct}`}
                unit="%"
                sub={result.soil.status}
                accent={result.soil.moisture_pct < 40}
              />
              <StatCard
                label="Temperature"
                value={result.weather.temperature_c}
                unit="°C"
                sub="Current"
              />
              <StatCard
                label="Humidity"
                value={result.weather.humidity_pct}
                unit="%"
                sub="Relative"
              />
            </div>

            {/* Weather + Yield row */}
            <div style={{ ...S.grid2, marginBottom: 16 }}>
              {/* Weather card */}
              <div style={S.card}>
                <p style={S.sectionTitle}>Rain & ET Forecast</p>
                <WeatherRow icon="🌧" label="Rain · 24h"  value={`${result.weather.rain_24h_mm} mm`} />
                <WeatherRow icon="🌧" label="Rain · 48h"  value={`${result.weather.rain_48h_mm} mm`} />
                <WeatherRow icon="🌧" label="Rain · 72h"  value={`${result.weather.rain_72h_mm} mm`} />
                <WeatherRow icon="💨" label="ET rate"     value={`${result.weather.et_rate_mm_day} mm/day`} />
              </div>

              {/* Yield card */}
              <div style={S.card}>
                <p style={S.sectionTitle}>Yield Intelligence</p>
                <YieldBar score={result.yield.score} outlook={result.yield.outlook} />
                <div style={{ marginTop: 20 }}>
                  <WeatherRow
                    icon="📊"
                    label="Water stress index"
                    value={result.yield.water_stress_index}
                  />
                </div>
                <p style={{ fontSize: 12, color: "#4b5563", marginTop: 12, lineHeight: 1.5 }}>
                  Score reflects available water vs crop demand for this {result.growth_stage} stage.
                </p>
              </div>
            </div>

            {/* SMS alert */}
            <SMSAlert text={result.sms_alert} />

            {/* Data source note */}
            <p style={{ textAlign: "center", fontSize: 11, color: "#374151", marginTop: 20 }}>
              Weather · Open-Meteo (real-time) · Model · Random Forest + XGBoost · MIT License
            </p>
          </div>
        )}
      </div>
    </div>
  );
}