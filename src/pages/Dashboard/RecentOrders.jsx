// src/components/Dashboard/RecentOrders.jsx
import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const RecentOrders = ({ orders = [], loading = false, onViewOrder }) => {
  const columns = [
    {
      title: 'Pedido',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong>#{id}</strong>,
    },
    {
      title: 'Cliente',
      dataIndex: ['cliente', 'nome'],
      key: 'cliente',
    },
    {
      title: 'Valor',
      dataIndex: 'valor_total',
      key: 'valor',
      render: (valor) => (
        <span style={{ fontWeight: 'bold' }}>
          R$ {valor.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pendente: 'orange',
          confirmado: 'blue',
          enviado: 'purple',
          entregue: 'green',
          cancelado: 'red',
        };
        return (
          <Tag color={colors[status] || 'default'}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Data',
      dataIndex: 'data_pedido',
      key: 'data',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => onViewOrder?.(record.id)}
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <Card 
      title="🛒 Pedidos Recentes"
      loading={loading}
    >
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default RecentOrders;