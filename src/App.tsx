import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AlertCircle, TrendingUp, Shield, Activity, Thermometer, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

const BoilerIntelligenceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'Efficiency', value: 92.5, unit: '%', trend: 'up', target: 95 },
    { name: 'Steam Output', value: 1250, unit: 'kg/h', trend: 'stable', target: 1300 },
    { name: 'Fuel Consumption', value: 450, unit: 'kg/h', trend: 'down', target: 420 },
    { name: 'Temperature', value: 245, unit: '°C', trend: 'up', target: 250 },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chartData, setChartData] = useState<any>({
    labels: ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM'],
    datasets: [
      {
        label: 'Boiler Efficiency',
        data: [88, 90, 91, 92, 93, 92.5],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: m.value + (Math.random() - 0.5) * 2,
          trend: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down' | 'stable',
        }))
      );
      setChartData((prev: any) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: [...prev.datasets[0].data.slice(1), 92 + (Math.random() - 0.5) * 3],
          },
        ],
        labels: [...prev.labels.slice(1), new Date().toLocaleTimeString().slice(0, 5)],
      }));
    }, 5000);

    // Mock alerts
    setAlerts([
      { id: 1, type: 'warning' as const, message: 'Anomaly detected in heat exchanger', timestamp: '10:05 PM' },
      { id: 2, type: 'critical' as const, message: 'Predictive maintenance: Tube fouling risk high', timestamp: '09:45 PM' },
      { id: 3, type: 'info' as const, message: 'Efficiency optimized - 1.2% improvement', timestamp: '09:30 PM' },
    ]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Boiler Intelligence Dashboard
        </h1>
        <p className="text-gray-400 mt-2">AI-Powered Predictive Monitoring & Optimization</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700 shadow-2xl hover:shadow-blue-500/25 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">{metric.name}</p>
                <p className="text-3xl font-bold">
                  {metric.value.toFixed(1)} <span className="text-xl text-gray-400">{metric.unit}</span>
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
                  </span>
                  <span className="ml-1 text-sm text-gray-400">vs target {metric.target}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.value > metric.target ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                {metric.value > metric.target ? <Shield size={24} /> : <Activity size={24} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Efficiency Chart */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center"><Thermometer size={28} className="mr-3" /> Real-Time Efficiency Trend</h2>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} height={400} />
        </div>

        {/* Health Gauge */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center"><Activity size={28} className="mr-3" /> Asset Health</h2>
          <Doughnut
            data={{
              labels: ['Healthy', 'Warning', 'Critical'],
              datasets: [{ data: [75, 20, 5], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
          />
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center"><AlertCircle size={28} className="mr-3 text-yellow-400" /> AI Alerts & Predictions</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border-l-4 ${
                alert.type === 'critical'
                  ? 'bg-red-500/10 border-red-500'
                  : alert.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500'
                  : 'bg-blue-500/10 border-blue-500'
              } backdrop-blur-xl shadow-xl hover:shadow-red-500/20 transition-all`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  alert.type === 'critical' ? 'bg-red-500/20' : alert.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  <AlertTriangle size={24} className={`${
                    alert.type === 'critical' ? 'text-red-400' : alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold text-lg">{alert.message}</p>
                  <p className="text-gray-400 text-sm mt-1">{alert.timestamp} IST</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        Powered by Agentic AI | Predictive Maintenance | Energy Optimization [Live Data Simulation]
      </footer>
    </div>
  );
};

export default BoilerIntelligenceDashboard;
