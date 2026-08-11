// src/components/Dashboard/MetricCard.jsx
import React from 'react';
import { Card, Statistic, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

const MetricCard = ({ 
  title, 
  value, 
  prefix = 'R$', 
  precision = 2, 
  trend = null, 
  color = '#1890ff',
  loading = false,
  onClick = null 
}) => {
  const renderTrend = () => {
    if (!trend) return null;
    
    const isPositive = trend > 0;
    return (
      <span style={{ color: isPositive ? '#52c41a' : '#ff4d4f', fontSize: 14 }}>
        {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        {' '}{Math.abs(trend)}%
      </span>
    );
  };

  return (
    <Card 
      hoverable={!!onClick}
      onClick={onClick}
      loading={loading}
      className="metric-card"
    >
      <Statistic
        title={
          <span>
            {title}
            <Tooltip title={`Detalhes de ${title.toLowerCase()}`}>
              <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
            </Tooltip>
          </span>
        }
        value={value}
        precision={precision}
        prefix={prefix}
        suffix={renderTrend()}
        valueStyle={{ color }}
      />
    </Card>
  );
};

export default MetricCard;