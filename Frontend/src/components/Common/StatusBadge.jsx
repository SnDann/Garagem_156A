import React from 'react';

export default function StatusBadge({ label, color = '#64748b' }) {
  return <span style={{ background: color, color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '999px' }}>{label}</span>;
}
