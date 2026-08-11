// frontend/src/pages/ClienteGaragem.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Timeline, Tag, Spin, Button, message } from 'antd';
import { 
  CarOutlined, 
  EnvironmentOutlined, 
  CheckCircleOutlined,
  WhatsAppOutlined 
} from '@ant-design/icons';
import api from '../services/api';
import moment from 'moment';

const ClienteGaragem = () => {
  const { clienteId } = useParams();
  const [garagem, setGaragem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pedidoRastreio, setPedidoRastreio] = useState(null);

  useEffect(() => {
    loadGaragem();
  }, [clienteId]);

  const loadGaragem = async () => {
    try {
      const response = await api.get(`/clientes/${clienteId}/garagem`);
      setGaragem(response.data);
    } catch (error) {
      message.error('Erro ao carregar garagem');
    } finally {
      setLoading(false);
    }
  };

  const consultarRastreio = async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/rastreio`);
      setPedidoRastreio(response.data);
    } catch (error) {
      message.error('Erro ao consultar rastreio');
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <div className="cliente-garagem">
      <div className="garagem-header">
        <h1>🏎️ Garagem de {garagem?.cliente}</h1>
        <p>Total de miniaturas: {garagem?.total_miniaturas}</p>
      </div>

      <div className="garagem-content">
        <div className="miniaturas-grid">
          {garagem?.miniaturas.map((miniatura) => (
            <Card
              key={miniatura.id}
              hoverable
              className="miniatura-card"
              cover={
                <div className="miniatura-placeholder">
                  <CarOutlined style={{ fontSize: 48 }} />
                </div>
              }
            >
              <Card.Meta
                title={miniatura.nome}
                description={
                  <>
                    <Tag color="blue">{miniatura.marca}</Tag>
                    <Tag color="green">{miniatura.escala}</Tag>
                    <p>Cor: {miniatura.cor}</p>
                    <Button 
                      type="link" 
                      onClick={() => consultarRastreio(miniatura.pedido_id)}
                    >
                      Ver pedido #{miniatura.pedido_id}
                    </Button>
                  </>
                }
              />
            </Card>
          ))}
        </div>

        {/* Rastreio do Pedido */}
        {pedidoRastreio && (
          <Card 
            title="📦 Rastreamento do Pedido" 
            className="rastreio-card"
            extra={
              <Button 
                icon={<WhatsAppOutlined />} 
                type="primary"
              >
                Compartilhar via WhatsApp
              </Button>
            }
          >
            <Timeline>
              {pedidoRastreio.eventos?.map((evento, index) => (
                <Timeline.Item 
                  key={index}
                  color={evento.status === 'entregue' ? 'green' : 'blue'}
                  dot={
                    evento.status === 'entregue' ? 
                    <CheckCircleOutlined /> : 
                    <EnvironmentOutlined />
                  }
                >
                  <p><strong>{evento.status}</strong></p>
                  <p>{evento.local}</p>
                  <p>{moment(evento.data).format('DD/MM/YYYY HH:mm')}</p>
                </Timeline.Item>
              ))}
            </Timeline>
            
            {pedidoRastreio.previsao_entrega && (
              <div className="previsao-entrega">
                <Tag color="orange">
                  📅 Previsão de entrega: {moment(pedidoRastreio.previsao_entrega).format('DD/MM/YYYY')}
                </Tag>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClienteGaragem;