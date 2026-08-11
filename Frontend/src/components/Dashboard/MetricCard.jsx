import React from 'react';

export default function MetricCard({ title, value }) {
  return (
    <div>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
