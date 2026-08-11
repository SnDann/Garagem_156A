// src/components/Miniaturas/MiniaturaGrid.jsx
import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import MiniaturaCard from './MiniaturaCard';
import './MiniaturaGrid.css';

const MiniaturaGrid = ({ 
  miniaturas, 
  loading, 
  onAddToCart,
  onFavorite 
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Carregando miniaturas..." />
      </div>
    );
  }

  if (!miniaturas?.length) {
    return (
      <Empty 
        description="Nenhuma miniatura encontrada"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="miniaturas-grid">
      <Row gutter={[16, 16]}>
        {miniaturas.map((miniatura) => (
          <Col xs={24} sm={12} md={8} lg={6} key={miniatura.id}>
            <MiniaturaCard
              miniatura={miniatura}
              onAddToCart={onAddToCart}
              onFavorite={onFavorite}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MiniaturaGrid;