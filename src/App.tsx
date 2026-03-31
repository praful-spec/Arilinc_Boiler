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

// ── Multi-Boiler Data Generator ────────────────────────
const generateMultiBoilerData = () => {
  const boilers = [];
  
  for (let b = 1; b <= 3; b++) { // 3 boilers
    const data = [];
    for (let i = 0; i < 24; i++) { // Last 24 hours
      const now = Date.now() - (23 - i) * 60 * 60 * 1000; // Live timestamps
      const hour = new Date(now).toLocaleString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      const anomaly = i > 18;
      const critical = i > 21;
      
      data.push({
        timestamp: now,
        hour,
        temperature: +(220 + Math.sin(i * 0.3 + b) * 10 + (anomaly ? (i - 18) * 2 : 0)).toFixed(1),
        pressure: +(12 + Math.cos(i * 0.2 + b * 0.5) * 1 - (anomaly ? (i - 18) * 0.08 : 0)).toFixed(2),
        efficiency: +(92 - (anomaly ? (i - 18) * 0.8 : 0) - Math.random() * 0.8).toFixed(1),
        oxygen: +(4.5 + (anomaly ? (i - 18) * 0.2 : 0) + b * 0.1).toFixed(2),
        status: critical ? "critical" : anomaly ? "warning" : "normal",
        boiler: `Boiler-${b}`,
      });
    }
    boilers.push({ name: `Boiler-${b}`, data });
  }
  return boilers;
};

// ── LIVE DATA ──────────────────────────────────────────
const initialData = generateMultiBoilerData();
const latestData = initialData.map(boiler => boiler.data[boiler.data.length - 1]);

// ── Component ──────────────────────────────────────────
export default function BoilerAI() {
  const [boilers, setBoilers] = useState(initialData);
  const [activeBoiler, setActiveBoiler] = useState(0);
  const [agentMsgs, setAgentMsgs] = useState([]);
  const [running, setRunning] = useState(false);
