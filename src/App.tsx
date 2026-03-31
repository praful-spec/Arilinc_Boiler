import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ── Synthetic Boiler Data ─────────────────────────────
const generateBoilerData = () => {
  const data = [];
  for (let i = 0; i < 72; i++) {
    const anomaly = i > 45;
    const critical = i > 60;

    const efficiency =
      85 -
      (anomaly ? (i - 45) * 0.6 : 0) -
      Math.random() * 1.2;

    data.push({
      hour: `${Math.floor(i / 24)}d ${i % 24}h`,
      temperature: +(220 + Math.sin(i * 0.2) * 8 + (anomaly ? (i - 45) * 1.5 : 0)).toFixed(1),
      pressure: +(12 + Math.cos(i * 0.15) * 0.8 - (anomaly ? (i - 45) * 0.05 : 0)).toFixed(2),
      efficiency: +efficiency.toFixed(1),
      oxygen: +(5 + (anomaly ? (i - 45) * 0.15 : 0)).toFixed(2),
      status: critical ? "critical" : anomaly ? "warning" : "normal",
    });
  }
  return data;
};

const data = generateBoilerData();

// ── KPI Calculation ─────────────────────────────
const latest = data[data.length - 1];

const fuelLoss = ((85 - latest.efficiency) * 12000).toFixed(0); // ₹ logic
const savings = Math.max(0, fuelLoss * 0.7);

// ── Component ─────────────────────────────
export default function BoilerAI() {
  const [agentMsgs, setAgentMsgs] = useState([]);
  const [running, setRunning] = useState(false);

  const runAgent = () => {
    setRunning(true);
    setAgentMsgs([]);

    const msgs = [
      "🔍 Observing boiler signals...",
      `📊 Efficiency dropped to ${latest.efficiency}%`,
      `🔥 Oxygen rising to ${latest.oxygen}% → combustion imbalance`,
      "🧠 Matched with historical combustion inefficiency patterns",
      "⚡ Fuel loss estimated from efficiency degradation",
      `✅ Recommendation: Optimize air-fuel ratio → Save ₹${(savings / 1000).toFixed(1)}K/month`,
    ];

    let i = 0;
    const iv = setInterval(() => {
      setAgentMsgs((p) => [...p, msgs[i]]);
      i++;
      if (i >= msgs.length) {
        clearInterval(iv);
        setRunning(false);
      }
    }, 800);
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>
          Boiler Intelligence — Agentic AI
        </div>
        <div style={{ color: "#64748b", fontSize: 13 }}>
          Combustion · Efficiency · Fuel Optimization
        </div>
      </div>

      {/* KPI ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Efficiency", value: `${latest.efficiency}%`, color: "#1d4ed8" },
          { label: "Temperature", value: `${latest.temperature}°C`, color: "#ef4444" },
          { label: "Pressure", value: `${latest.pressure} bar`, color: "#0891b2" },
          { label: "Fuel Loss", value: `₹${(fuelLoss / 1000).toFixed(1)}K`, color: "#d97706" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#fff", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        
        {/* Efficiency */}
        <div style={{ background: "#fff", padding: 16, borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Efficiency (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={75} stroke="#ef4444" />
              <Area type="monotone" dataKey="efficiency" stroke="#1d4ed8" fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature */}
        <div style={{ background: "#fff", padding: 16, borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Temperature (°C)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI AGENT */}
      <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>
          🤖 AI Agent — Combustion Intelligence
        </div>

        <button
          onClick={runAgent}
          disabled={running}
          style={{
            background: "linear-gradient(135deg,#1d4ed8,#0891b2)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            marginBottom: 14,
          }}
        >
          {running ? "Running..." : "Run AI Agent"}
        </button>

        {agentMsgs.map((m, i) => (
          <div key={i} style={{ fontSize: 13, marginBottom: 6 }}>
            {m}
          </div>
        ))}

        {/* FINAL INSIGHT */}
        {!running && agentMsgs.length > 0 && (
          <div style={{ marginTop: 12, padding: 12, background: "#eff6ff", borderRadius: 8 }}>
            <strong>🔥 Key Insight:</strong> Combustion inefficiency detected  
            <br />
            <strong>💰 Value:</strong> ₹{(savings / 1000).toFixed(1)}K/month saving potential
          </div>
        )}
      </div>
    </div>
  );
}
