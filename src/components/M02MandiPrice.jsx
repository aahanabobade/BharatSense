import { useState, useCallback, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const COMMODITIES = {
  tomato:  { label: "Tomato",  emoji: "🍅", color: "#ef4444" },
  onion:   { label: "Onion",   emoji: "🧅", color: "#f97316" },
  potato:  { label: "Potato",  emoji: "🥔", color: "#eab308" },
  wheat:   { label: "Wheat",   emoji: "🌾", color: "#84cc16" },
  rice:    { label: "Rice",    emoji: "🌾", color: "#22c55e" },
  cotton:  { label: "Cotton",  emoji: "🌿", color: "#6366f1" },
};

const MANDIS = {
  nasik:     "Nashik, Maharashtra",
  delhi:     "Delhi",
  bangalore: "Bengaluru, Karnataka",
  pune:      "Pune, Maharashtra",
  chennai:   "Chennai, Tamil Nadu",
  kolkata:   "Kolkata, West Bengal",
  agra:      "Agra, UP",
  indore:    "Indore, MP",
  amritsar:  "Amritsar, Punjab",
  hyderabad: "Hyderabad, Telangana",
};

// ── Mini chart using SVG ──────────────────────────────────────────────────────
function PriceChart({ history, forecast, forecastDates, lowerBand, upperBand, unit, color }) {
  const W = 720, H = 200, PAD = 36;

  const allPrices = [...history.prices, ...forecast, ...lowerBand, ...upperBand];
  const minP = Math.min(...allPrices) * 0.95;
  const maxP = Math.max(...allPrices) * 1.05;

  const totalDates = [...history.dates, ...forecastDates];

  const totalPoints = totalDates.length;

  const xScale = (i) => PAD + (i / (totalPoints - 1)) * (W - PAD * 2);
  const yScale = (p) => H - PAD - ((p - minP) / (maxP - minP)) * (H - PAD * 2);

  // History line
  const historyPath = history.prices
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(p)}`)
    .join(" ");

  // Forecast line
  const fcStart = history.prices.length - 1;
  const forecastPath = [history.prices[fcStart], ...forecast]
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(fcStart + i)},${yScale(p)}`)
    .join(" ");

  // Uncertainty band
  const bandPath = [
    ...lowerBand.map((p, i) => `${i === 0 ? `M${xScale(fcStart + 1)}` : "L"}${xScale(fcStart + 1 + i)},${yScale(p)}`),
    ...[...upperBand].reverse().map((p, i) => `L${xScale(fcStart + upperBand.length - i)},${yScale(p)}`),
    "Z",
  ].join(" ");

  // X-axis labels — show every 7th date
  const labelIndices = [0, 7, 14, 21, 29, 30, 37, 44];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 340, display: "block" }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD + t * (H - PAD * 2);
          const price = maxP - t * (maxP - minP);
          return (
            <g key={t}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={PAD - 4} y={y + 4} textAnchor="end"
                fill="#4b5563" fontSize={9} fontFamily="monospace">
                {price >= 1000 ? `${(price / 1000).toFixed(1)}k` : price.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Forecast divider */}
        <line
          x1={xScale(fcStart)} y1={PAD}
          x2={xScale(fcStart)} y2={H - PAD}
          stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4,4"
        />
        <text x={xScale(fcStart) + 4} y={PAD + 10}
          fill="#6b7280" fontSize={8} fontFamily="monospace">
          FORECAST →
        </text>

        {/* Uncertainty band */}
        <path d={bandPath} fill={color} opacity={0.08} />

        {/* History line */}
        <path d={historyPath} fill="none" stroke="#4b5563" strokeWidth={1.5} />

        {/* Forecast line */}
        <path d={forecastPath} fill="none" stroke={color}
          strokeWidth={2} strokeDasharray="5,3" />

        {/* Current price dot */}
        <circle
          cx={xScale(fcStart)} cy={yScale(history.prices[fcStart])}
          r={4} fill={color} stroke="#0a0f0a" strokeWidth={2}
        />

        {/* X labels */}
        {labelIndices.map((idx) => {
          if (idx >= totalDates.length) return null;
          return (
            <text key={idx}
              x={xScale(idx)} y={H - 4}
              textAnchor="middle" fill="#4b5563"
              fontSize={8} fontFamily="monospace">
              {totalDates[idx]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ChangeChip({ value, pct }) {
  const up    = pct >= 0;
  const color = up ? "#4ade80" : "#f87171";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 12, color,
      background: up ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
      border: `1px solid ${up ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
      borderRadius: 99, padding: "2px 8px",
    }}>
      {up ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

function RecommendationCard({ rec, unit }) {
  const isSell = rec.action === "SELL NOW";
  const color  = isSell ? "#f87171" : "#4ade80";
  const bg     = isSell ? "rgba(248,113,113,0.08)" : "rgba(74,222,128,0.08)";
  const border = isSell ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.25)";

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>{isSell ? "⚡" : "🕐"}</span>
        <span style={{ fontSize: 20, fontWeight: 800, color }}>{rec.action}</span>
      </div>
      <p style={{ fontSize: 13, color: "#d1d5db", margin: "0 0 12px", lineHeight: 1.6 }}>
        {rec.reason}
      </p>
      {rec.hold_days > 0 && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>PEAK PRICE</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, color: "#f9fafb", fontWeight: 700 }}>
              {unit[0]}{rec.peak_price}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>IN DAYS</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, color: "#f9fafb", fontWeight: 700 }}>
              {rec.peak_day}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>POTENTIAL GAIN</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, color: "#4ade80", fontWeight: 700 }}>
              +{rec.gain_pct}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SMSAlert({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{
      background: "rgba(251,191,36,0.06)",
      border: "1px solid rgba(251,191,36,0.2)",
      borderRadius: 12, padding: "16px 18px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#fbbf24", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          📱 SMS Alert
        </span>
        <button
          onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ background: "rgba(251,191,36,0.15)", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#fbbf24", cursor: "pointer" }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p style={{ fontSize: 13, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function M02MandiPrice() {
  const [commodity, setCommodity] = useState("tomato");
  const [mandi,     setMandi]     = useState("nasik");
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const commodityColor = COMMODITIES[commodity]?.color || "#4ade80";

  const fetchPrediction = useCallback(async (c, m) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/m02/predict?commodity=${c}&mandi=${m}`);
      if (!res.ok) throw new Error((await res.json()).detail || "Prediction failed");
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount and when selection changes
  useEffect(() => {
    fetchPrediction(commodity, mandi);
  }, [commodity, mandi, fetchPrediction]);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    wrap: {
      minHeight: "100vh",
      background: "#040f1f",
      color: "#f9fafb",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    inner:   { maxWidth: 860, margin: "0 auto" },
    badge:   {
      display: "inline-block",
      background: "rgba(74,222,128,0.12)",
      border: "1px solid rgba(74,222,128,0.25)",
      color: "#4ade80", borderRadius: 99,
      padding: "4px 14px", fontSize: 12, fontWeight: 600,
      letterSpacing: "0.06em", marginBottom: 16,
    },
    h1: {
      fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 8px",
      background: "linear-gradient(135deg, #f9fafb 40%, #4ade80)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    },
    subtitle: { fontSize: 15, color: "#6b7280", margin: "0 0 32px" },
    card: {
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18, padding: "24px", marginBottom: 18,
    },
    label: {
      display: "block", fontSize: 11, color: "#6b7280",
      marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase",
    },
    select: {
      width: "100%", background: "#071020",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "11px 14px",
      color: "#f9fafb", fontSize: 14, outline: "none",
      fontFamily: "inherit", cursor: "pointer", boxSizing: "border-box",
    },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    sectionLabel: {
      fontSize: 11, color: "#6b7280", letterSpacing: "0.08em",
      textTransform: "uppercase", marginBottom: 14,
    },
    statVal: {
      fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "#f9fafb",
    },
    statSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  };

  // ── Commodity pills ──────────────────────────────────────────────────────────
  const renderCommodityPills = () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
      {Object.entries(COMMODITIES).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => setCommodity(key)}
          style={{
            background: commodity === key ? `${cfg.color}18` : "rgba(255,255,255,0.03)",
            border: `1px solid ${commodity === key ? cfg.color + "55" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 99, padding: "6px 14px",
            color: commodity === key ? cfg.color : "#6b7280",
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          {cfg.emoji} {cfg.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={S.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={S.inner}>

        {/* Header */}
        <div style={S.badge}>M02 · Agriculture</div>
        <h1 style={S.h1}>Mandi Price Predictor</h1>
        <p style={S.subtitle}>
          14-day price forecast · LSTM time-series model · 3,000 mandis across India
        </p>

        {/* Selectors */}
        <div style={S.card}>
          <p style={S.sectionLabel}>Select Commodity</p>
          {renderCommodityPills()}
          <p style={S.sectionLabel}>Select Mandi</p>
          <select
            style={S.select}
            value={mandi}
            onChange={(e) => setMandi(e.target.value)}
          >
            {Object.entries(MANDIS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#4b5563" }}>
            <div style={{ fontSize: 13, letterSpacing: "0.1em" }}>LOADING PRICE DATA…</div>
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 10, padding: "12px 16px",
            color: "#f87171", fontSize: 13, marginBottom: 16,
          }}>
            ⚠ {error}
          </div>
        )}

        {result && !loading && (
          <>
            {/* Price header */}
            <div style={{ ...S.card, borderColor: `${commodityColor}22` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={S.sectionLabel}>Current Price · {result.mandi_label}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ ...S.statVal, color: commodityColor }}>
                      {result.unit[0]}{result.current_price}
                    </span>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>{result.unit}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>vs last week</span>
                    <ChangeChip value={result.price_changes.vs_week_ago} pct={result.price_changes.vs_week_pct} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>vs last month</span>
                    <ChangeChip value={result.price_changes.vs_month_ago} pct={result.price_changes.vs_month_pct} />
                  </div>
                </div>
              </div>

              {/* Forecast summary */}
              <div style={{
                marginTop: 16,
                display: "flex", gap: 20, flexWrap: "wrap",
                padding: "14px 0 0",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div>
                  <div style={S.sectionLabel}>14-Day Forecast</div>
                  <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "#f9fafb" }}>
                    {result.unit[0]}{result.forecast.prices[13]}
                  </div>
                </div>
                <div>
                  <div style={S.sectionLabel}>Trend</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: result.forecast.trend === "up" ? "#4ade80" : result.forecast.trend === "down" ? "#f87171" : "#fbbf24" }}>
                    {result.forecast.trend === "up" ? "↑ Rising" : result.forecast.trend === "down" ? "↓ Falling" : "→ Stable"}
                    {" "}{Math.abs(result.forecast.trend_pct)}%
                  </div>
                </div>
                <div>
                  <div style={S.sectionLabel}>Confidence</div>
                  <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: "#f9fafb" }}>
                    {result.forecast.confidence}%
                  </div>
                </div>
                <div>
                  <div style={S.sectionLabel}>Data Source</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{result.data_source}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={S.card}>
              <p style={S.sectionLabel}>30-Day History + 14-Day Forecast</p>
              <PriceChart
                history={result.history}
                forecast={result.forecast.prices}
                forecastDates={result.forecast.dates}   // ← add this
                lowerBand={result.forecast.lower_band}
                upperBand={result.forecast.upper_band}
                unit={result.unit}
                color={commodityColor}
              />
              <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 2, background: "#4b5563" }} />
                  <span style={{ fontSize: 11, color: "#4b5563" }}>Historical price</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 2, background: commodityColor, borderTop: "2px dashed" }} />
                  <span style={{ fontSize: 11, color: "#4b5563" }}>Forecast</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 8, background: `${commodityColor}22`, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: "#4b5563" }}>Uncertainty band</span>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ ...S.sectionLabel, marginBottom: 10 }}>Sell Recommendation</p>
              <RecommendationCard rec={result.recommendation} unit={result.unit} />
            </div>

            {/* SMS */}
            <SMSAlert text={result.sms_alert} />

            <p style={{ textAlign: "center", fontSize: 11, color: "#374151", marginTop: 20 }}>
              Model · LSTM Time-Series · Data · Agmarknet-calibrated · MIT License
            </p>
          </>
        )}
      </div>
    </div>
  );
}