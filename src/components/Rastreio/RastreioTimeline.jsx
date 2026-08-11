// src/components/Pedidos/RastreioTimeline.jsx
import React from 'react';
import { Timeline, Card, Tag, Steps, Button, message } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Step } = Steps;

const RastreioTimeline = ({ rastreio, pedidoId, onUpdate }) => {
  const [updating, setUpdating] = React.useState(false);

  const handleUpdateRastreio = async () => {
    try {
      setUpdating(true);
      await onUpdate(pedidoId);
      message.success('Rastreio atualizado!');
    } catch (error) {
      message.error('Erro ao atualizar rastreio');
    } finally {
      setUpdating(false);
    }
  };

  const getStepStatus = (index, currentStatus) => {
    const statusFlow = ['pendente', 'confirmado', 'preparacao', 'enviado', 'entregue'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (index < currentIndex) return 'finish';
    if (index === currentIndex) return 'process';
    return 'wait';
  };

  return (
    <Card
      title={
        <div className="rastreio-title">
          <span>📦 Rastreio do Pedido #{pedidoId}</span>
          <Button 
            icon={<SyncOutlined spin={updating} />}
            onClick={handleUpdateRastreio}
            loading={updating}
          >
            Atualizar
          </Button>
        </div>
      }
      extra={
        <Button 
          type="primary" 
          icon={<WhatsAppOutlined />}
        >
          Compartilhar via WhatsApp
        </Button>
      }
    >
      <div className="rastreio-content">
        <div className="rastreio-info">
          <div className="info-item">
            <strong>Código de Rastreio:</strong>
            <Tag color="blue">{rastreio?.codigo || 'N/A'}</Tag>
          </div>
          
          {rastreio?.previsao_entrega && (
            <div className="info-item">
              <strong>Previsão de Entrega:</strong>
              <Tag color="orange">
                {moment(rastreio.previsao_entrega).format('DD/MM/YYYY')}
              </Tag>
            </div>
          )}
        </div>

        <Steps 
          current={1} 
          status="process"
          className="rastreio-steps"
        >
          <Step 
            title="Pedido" 
            description="Confirmado" 
            icon={<CheckCircleOutlined />}
            status={getStepStatus(0, rastreio?.status)}
          />
          <Step 
            title="Preparação" 
            description="Separando" 
            icon={<ClockCircleOutlined />}
            status={getStepStatus(1, rastreio?.status)}
          />
          <Step 
            title="Transporte" 
            description="Em trânsito" 
            icon={<CarOutlined />}
            status={getStepStatus(2, rastreio?.status)}
          />
          <Step 
            title="Entrega" 
            description="Recebido" 
            icon={<EnvironmentOutlined />}
            status={getStepStatus(3, rastreio?.status)}
          />
        </Steps>

        <div className="rastreio-events">
          <h3>Histórico de Eventos</h3>
          <Timeline>
            {rastreio?.eventos?.map((evento, index) => (
              <Timeline.Item
                key={index}
                color={evento.tipo === 'entrega' ? 'green' : 'blue'}
                dot={
                  evento.tipo === 'entrega' ? 
                  <CheckCircleOutlined /> : 
                  <EnvironmentOutlined />
                }
              >
                <div className="timeline-event">
                  <p className="event-status">
                    <strong>{evento.status}</strong>
                  </p>
                  <p className="event-local">
                    📍 {evento.local} - {evento.cidade}/{evento.estado}
                  </p>
                  <p className="event-date">
                    🕐 {moment(evento.data).format('DD/MM/YYYY HH:mm')}
                  </p>
                  {evento.observacao && (
                    <p className="event-obs">💬 {evento.observacao}</p>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    </Card>
  );
};

export default RastreioTimeline;