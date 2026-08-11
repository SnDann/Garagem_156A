import React from 'react';

export default function KpiTrendCard({ title, value, subtitle, icon, trend, accent = 'primary' }) {
  const isPositive = trend >= 0;
  const accentColor = accent === 'success' ? '#34d399' : '#38bdf8';

  return (
    <div className="metric-card kpi-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="metric-icon" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #818cf8 100%)` }}>{icon}</div>
        <div className={`kpi-trend-pill ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↗' : '↘'} {Math.abs(trend).toFixed(0)}%
        </div>
      </div>
      <h3 style={{ margin: '10px 0 4px', color: '#e2e8f0' }}>{title}</h3>
      <p style={{ fontSize: 28, margin: 0, fontWeight: 700, color: '#f8fafc' }}>{value}</p>
      <p style={{ color: '#94a3b8', margin: '6px 0 0', fontSize: 13 }}>{subtitle}</p>
    </div>
  );
}
