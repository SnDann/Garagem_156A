import React from 'react';
import { designTokens } from '../../styles/designTokens';

export default function LuxuryPanelCard({ title, subtitle, children, accent = 'primary' }) {
  const accentColor = accent === 'success' ? designTokens.colors.success : designTokens.colors.primary;

  return (
    <section
      style={{
        background: `linear-gradient(145deg, ${designTokens.colors.surface} 0%, ${designTokens.colors.surfaceAlt} 100%)`,
        border: `1px solid ${designTokens.colors.border}`,
        borderRadius: designTokens.radius.lg,
        boxShadow: designTokens.shadows.soft,
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: accentColor }} />
        <div>
          <h3 style={{ margin: 0, color: designTokens.colors.text }}>{title}</h3>
          {subtitle ? <p style={{ margin: '2px 0 0', color: designTokens.colors.textMuted }}>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
