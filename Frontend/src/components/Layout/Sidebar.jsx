import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', icon: '◉', to: '/dashboard' },
  { label: 'Clientes', icon: '👤', to: '/clientes' },
  { label: 'Miniaturas', icon: '🧩', to: '/miniaturas' },
  { label: 'Pedidos', icon: '🧾', to: '/pedidos' },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 240, padding: '20px 16px', background: 'rgba(2, 6, 23, 0.96)', borderRight: '1px solid rgba(148, 163, 184, 0.16)' }}>
      <div style={{ padding: '10px 12px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(129, 140, 248, 0.12))', marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.24em', color: '#7dd3fc', textTransform: 'uppercase' }}>Painel executivo</div>
        <h3 style={{ margin: '4px 0 0', color: '#f8fafc' }}>Garagem 156A</h3>
      </div>
      <nav style={{ display: 'grid', gap: 8 }}>
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            style={({ isActive }) => ({
              padding: '10px 12px',
              borderRadius: 12,
              color: isActive ? '#f8fafc' : '#cbd5e1',
              background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.24), rgba(129, 140, 248, 0.2))' : 'rgba(15, 23, 42, 0.8)',
              border: isActive ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(148,163,184,0.12)',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
            })}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
