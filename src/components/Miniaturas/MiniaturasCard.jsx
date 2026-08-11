// src/components/Miniaturas/MiniaturaCard.jsx
import React from 'react';
import { Card, Tag, Badge, Tooltip, Button, Rate } from 'antd';
import {
  CarOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import './MiniaturaCard.css';

const MiniaturaCard = ({ miniatura, onAddToCart, onFavorite }) => {
  const {
    id,
    nome,
    marca,
    escala,
    cor,
    categoria,
    preco_venda,
    quantidade,
    foto_url,
  } = miniatura;

  const getStockStatus = (qtd) => {
    if (qtd === 0) return { status: 'error', text: 'Esgotado' };
    if (qtd <= 5) return { status: 'warning', text: `Últimas ${qtd} unidades` };
    return { status: 'success', text: 'Disponível' };
  };

  const stockInfo = getStockStatus(quantidade);

  return (
    <Badge.Ribbon 
      text={stockInfo.text} 
      color={stockInfo.status === 'error' ? 'red' : stockInfo.status === 'warning' ? 'orange' : 'green'}
    >
      <Card
        hoverable
        className="miniatura-card"
        cover={
          <div className="miniatura-image">
            {foto_url ? (
              <img src={foto_url} alt={nome} />
            ) : (
              <div className="placeholder-image">
                <CarOutlined style={{ fontSize: 64 }} />
              </div>
            )}
            <div className="image-overlay">
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />}
                onClick={() => onAddToCart(id)}
                disabled={quantidade === 0}
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        }
        actions={[
          <Tooltip title="Favoritar">
            <HeartOutlined 
              key="favorite" 
              onClick={() => onFavorite(id)}
            />
          </Tooltip>,
          <Tooltip title="Compartilhar">
            <ShareAltOutlined key="share" />
          </Tooltip>,
        ]}
      >
        <Card.Meta
          title={
            <div className="card-title">
              <span>{nome}</span>
              <Tag color="blue">{escala}</Tag>
            </div>
          }
          description={
            <div className="card-details">
              <div className="marca-categoria">
                <Tag color="purple">{marca}</Tag>
                <Tag color="cyan">{categoria}</Tag>
              </div>
              
              <div className="cor-info">
                <div 
                  className="color-dot" 
                  style={{ backgroundColor: cor.toLowerCase() }}
                />
                <span>{cor}</span>
              </div>
              
              <div className="preco">
                <span className="preco-label">Preço:</span>
                <span className="preco-valor">
                  R$ {preco_venda.toFixed(2)}
                </span>
              </div>
              
              <div className="estoque-info">
                <Badge 
                  status={stockInfo.status} 
                  text={stockInfo.text}
                />
              </div>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default MiniaturaCard;