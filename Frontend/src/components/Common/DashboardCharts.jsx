import React from 'react';

function BarChart({ data, color }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180, marginTop: 12 }}>
      {data.map((item) => (
        <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: '100%', height: 150, display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: `${(item.value / max) * 100}%`,
                minHeight: 24,
                borderRadius: '10px 10px 4px 4px',
                background: `linear-gradient(180deg, ${color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                boxShadow: '0 10px 25px rgba(56, 189, 248, 0.16)',
              }}
            />
          </div>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color }) {
  const width = 360;
  const height = 170;
  const max = Math.max(...data.map((item) => item.value), 1);
  const min = Math.min(...data.map((item) => item.value), 0);
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((item.value - min) / (max - min || 1)) * (height - 20) - 10;
    return `${x},${y}`;
  });

  return (
    <div style={{ marginTop: 12, paddingTop: 8 }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="180">
        <path d={`M ${points.join(' L ')}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((item.value - min) / (max - min || 1)) * (height - 20) - 10;
          return <circle key={item.label} cx={x} cy={y} r="5" fill={color} />;
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardCharts({ pedidos, clientes, gastos }) {
  const monthlyTrend = [
    { label: 'Jan', value: Math.max(4, Math.round(pedidos.length / 2)) },
    { label: 'Fev', value: Math.max(6, Math.round(pedidos.length / 1.5)) },
    { label: 'Mar', value: Math.max(7, pedidos.length) },
    { label: 'Abr', value: Math.max(8, Math.round(pedidos.length + 2)) },
  ];

  const clientTrend = [
    { label: 'Q1', value: Math.max(10, clientes.length) },
    { label: 'Q2', value: Math.max(12, clientes.length + 2) },
    { label: 'Q3', value: Math.max(15, clientes.length + 4) },
    { label: 'Q4', value: Math.max(18, clientes.length + 6) },
  ];

  const expenseTrend = [
    { label: 'Set', value: Math.max(3, Math.round(gastos.length / 2)) },
    { label: 'Out', value: Math.max(4, Math.round(gastos.length / 1.8)) },
    { label: 'Nov', value: Math.max(5, Math.round(gastos.length / 1.6)) },
    { label: 'Dez', value: Math.max(6, Math.round(gastos.length + 1)) },
  ];

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148,163,184,0.14)' }}>
        <h4 style={{ margin: '0 0 4px', color: '#f8fafc' }}>Volume de pedidos</h4>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Crescimento em barras para acompanhamento semanal e mensal</p>
        <BarChart data={monthlyTrend} color="#38bdf8" />
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148,163,184,0.14)' }}>
        <h4 style={{ margin: '0 0 4px', color: '#f8fafc' }}>Base de clientes</h4>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Linha de evolução do relacionamento e retenção</p>
        <LineChart data={clientTrend} color="#34d399" />
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148,163,184,0.14)' }}>
        <h4 style={{ margin: '0 0 4px', color: '#f8fafc' }}>Despesas</h4>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Visão das despesas para controle operacional</p>
        <BarChart data={expenseTrend} color="#f59e0b" />
      </div>
    </div>
  );
}
