// src/components/Clientes/ClienteTable.jsx
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
  EyeOutlined,
  CarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import StatusBadge from '../Common/StatusBadge';

const ClienteTable = ({ 
  clientes, 
  loading, 
  onEdit, 
  onDelete, 
  onView,
  onWhatsApp,
  onViewGaragem 
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (nome, record) => (
        <a onClick={() => onView(record)}>{nome}</a>
      ),
    },
    {
      title: 'Contato',
      key: 'contato',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>📧 {record.email}</span>
          <span>📱 {record.telefone}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <StatusBadge status={status} />,
      filters: [
        { text: 'Ativo', value: 'ativo' },
        { text: 'Inativo', value: 'inativo' },
        { text: 'VIP', value: 'vip' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Total Compras',
      dataIndex: 'total_compras',
      key: 'total_compras',
      width: 150,
      sorter: (a, b) => a.total_compras - b.total_compras,
      render: (valor) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          R$ {valor.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Cadastro',
      dataIndex: 'data_cadastro',
      key: 'data_cadastro',
      width: 120,
      sorter: (a, b) => moment(a.data_cadastro).unix() - moment(b.data_cadastro).unix(),
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalhes">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          
          <Tooltip title="Ver garagem">
            <Button 
              type="link" 
              icon={<CarOutlined />}
              onClick={() => onViewGaragem(record)}
            />
          </Tooltip>
          
          <Tooltip title="WhatsApp">
            <Button 
              type="link" 
              icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
              onClick={() => onWhatsApp(record)}
            />
          </Tooltip>
          
          <Tooltip title="Editar">
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          
          <Popconfirm
            title="Tem certeza que deseja excluir este cliente?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={clientes}
      rowKey="id"
      loading={loading}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} clientes`,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default ClienteTable;