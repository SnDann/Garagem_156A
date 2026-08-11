import React from 'react';

export default function Header() {
  return (
    <header style={{ padding: '18px 24px', background: 'rgba(2, 6, 23, 0.95)', borderBottom: '1px solid rgba(148, 163, 184, 0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 12, letterSpacing: '0.24em', color: '#38bdf8', textTransform: 'uppercase' }}>Gestão premium</div>
        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 20 }}>Garagem 156A</div>
      </div>
      <div style={{ color: '#cbd5e1', background: 'rgba(15,23,42,0.8)', padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(148,163,184,0.14)' }}>⚡ Operação ativa</div>
    </header>
  );
}
