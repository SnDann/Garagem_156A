import React from 'react';

export default function FigmaReference() {
  return (
    <div style={{ marginTop: 18, padding: 18, borderRadius: 18, background: 'rgba(2, 6, 23, 0.75)', border: '1px solid rgba(148,163,184,0.16)' }}>
      <h4 style={{ margin: '0 0 8px', color: '#f8fafc' }}>Referência para Figma</h4>
      <p style={{ margin: '0 0 10px', color: '#94a3b8' }}>Estrutura de telas pronta para tradução visual em um sistema de design premium.</p>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          ['01. Shell', 'Sidebar, header, conteúdo principal'],
          ['02. Dashboard', 'KPI cards, gráficos, insights'],
          ['03. Cadastros', 'Clientes, miniaturas e pedidos'],
          ['04. Fluxo de gestão', 'Filtros, ações e estados'],
        ].map(([title, description]) => (
          <div key={title} style={{ padding: 12, borderRadius: 14, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148,163,184,0.14)' }}>
            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{title}</div>
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
