import React, { useEffect, useState, useRef } from 'react';

const BoilerIntelligenceDashboardNoDeps: React.FC = () => {
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animate efficiency line chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#3b82f6';
    ctx.beginPath();
    const points = [20, 40, 70, 85, 92, 90 + Math.sin(time / 10) * 2];
    points.forEach((p, i) => {
      const x = (i / 5) * canvas.width;
      const y = canvas.height - (p / 100) * canvas.height;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Health gauge arc
    ctx.save();
    ctx.translate(300, 150);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 20;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 80, -Math.PI / 2, (75 / 100) * Math.PI * 1.5 - Math.PI / 2);
    ctx.stroke();
    ctx.restore();
  }, [time]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 text-white p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
          Boiler Intelligence
        </h1>
        <p className="text-xl text-gray-300 mt-2 opacity-90">AI Predictive Dashboard • Live {new Date().toLocaleTimeString('en-IN')}</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { name: 'Efficiency', val: (92 + Math.sin(time / 20) * 1.5).toFixed(1), unit: '%', color: 'from-emerald-400 to-green-500', icon: '📈' },
          { name: 'Steam Flow', val: (1245 + Math.sin(time / 15) * 20).toFixed(0), unit: 'kg/h', color: 'from-blue-400 to-cyan-500', icon: '💨' },
          { name: 'Fuel Rate', val: (448 + Math.cos(time / 25) * 5).toFixed(0), unit: 'kg/h', color: 'from-orange-400 to-red-500', icon: '🔥' },
          { name: 'Temp', val: (246 + Math.sin(time / 30) * 2).toFixed(0), unit: '°C', color: 'from-yellow-400 to-amber-500', icon: '🌡️' },
        ].map((m, i) => (
          <div key={i} className={`group bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 hover:scale-[1.02]`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-400 uppercase tracking-wider text-sm font-medium opacity-80">{m.name}</p>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {m.val} <span className="text-2xl text-gray-400">{m.unit}</span>
                </div>
              </div>
              <span className="text-4xl p-3 bg-white/10 rounded-2xl group-hover:rotate-12 transition-all">{m.icon}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className={`h-2 rounded-full bg-gradient-to-r ${m.color} transition-all`} style={{ width: `${Math.min(100, parseFloat(m.val) * 0.8)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center text-cyan-300"><span className="w-3 h-3 bg-cyan-400 rounded-full mr-4 animate-pulse" />Efficiency Trend (24h)</h2>
          <canvas ref={canvasRef} width={600} height={300} className="w-full h-80 rounded-2xl" />
          <p className="text-gray-400 mt-6 text-center">AI-Optimized • Anomaly-Free</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center text-emerald-400"><span className="w-3 h-3 bg-emerald-400 rounded-full mr-4 animate-pulse" />Asset Health Score</h2>
          <div className="relative w-full h-80 flex items-center justify-center">
            <canvas width={400} height={400} className="w-64 h-64" />
            <div className="absolute text-center">
              <div className="text-5xl font-black text-emerald-400 drop-shadow-2xl">92%</div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Optimal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center text-orange-400"><span className="w-3 h-3 bg-orange-400 rounded-full mr-4 animate-pulse" />AI Predictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { type: '⚠️ Warning', msg: 'Heat exchanger anomaly detected', time: '10:09 PM' },
            { type: '🔥 Critical', msg: 'Tube fouling risk: 78% probability', time: '10:05 PM' },
            { type: '✅ Optimized', msg: '+1.4% efficiency gain applied', time: '09:58 PM' },
          ].map((a, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 backdrop-blur-xl hover:shadow-2xl hover:shadow-orange-500/25 transition-all hover:scale-[1.02]">
              <div className="flex items-start space-x-4">
                <span className="text-3xl p-3 bg-orange-500/20 rounded-2xl group-hover:rotate-6 transition-transform">{a.type === '✅ Optimized' ? '✅' : a.type}</span>
                <div>
                  <p className="font-bold text-xl mb-2">{a.msg}</p>
                  <p className="text-gray-400">{a.time} IST</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-20 text-center text-gray-500/70 text-lg py-12 border-t border-white/10">
        🚀 Boiler Intelligence • Agentic AI Platform • Optimized for {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Modern Browsers'}
      </footer>
    </div>
  );
};

export default BoilerIntelligenceDashboardNoDeps;
