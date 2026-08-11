// frontend/src/pages/ControleGastos.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, 
  Tag, Space, message, Card, Statistic, Row, Col 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../services/api';

const { Option } = Select;

const ControleGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGasto, setEditingGasto] = useState(null);
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState({
    categoria: null,
    dataInicio: null,
    dataFim: null
  });

  useEffect(() => {
    loadGastos();
  }, [filtros]);

  const loadGastos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/gastos', { params: filtros });
      setGastos(response.data);
    } catch (error) {
      message.error('Erro ao carregar gastos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingGasto) {
        await api.put(`/dashboard/gastos/${editingGasto.id}`, values);
        message.success('Gasto atualizado com sucesso!');
      } else {
        await api.post('/dashboard/gastos', values);
        message.success('Gasto adicionado com sucesso!');
      }
      setModalVisible(false);
      form.resetFields();
      loadGastos();
    } catch (error) {
      message.error('Erro ao salvar gasto');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este gasto?',
      onOk: async () => {
        try {
          await api.delete(`/dashboard/gastos/${id}`);
          message.success('Gasto excluído com sucesso!');
          loadGastos();
        } catch (error) {
          message.error('Erro ao excluir gasto');
        }
      }
    });
  };

  const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);
  
  const gastosPorCategoria = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.valor;
    return acc;
  }, {});

  const columns = [
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.data).unix() - moment(b.data).unix()
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao'
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria',
      render: (categoria) => {
        const colors = {
          'Estoque': 'blue',
          'Marketing': 'green',
          'Operacional': 'orange',
          'Infraestrutura': 'purple',
          'Outros': 'gray'
        };
        return <Tag color={colors[categoria] || 'default'}>{categoria}</Tag>;
      }
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (valor) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      ),
      sorter: (a, b) => a.valor - b.valor
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingGasto(record);
              form.setFieldsValue({
                ...record,
                data: moment(record.data)
              });
              setModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            Excluir
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="controle-gastos">
      <h1>💸 Controle de Gastos</h1>
      
      {/* Cards de Resumo */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Gastos"
              value={totalGastos}
              precision={2}
              prefix="R$"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        {Object.entries(gastosPorCategoria).map(([categoria, valor]) => (
          <Col span={6} key={categoria}>
            <Card>
              <Statistic
                title={categoria}
                value={valor}
                precision={2}
                prefix="R$"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filtros e Ações */}
      <div className="actions-bar">
        <Space>
          <Select
            placeholder="Filtrar por categoria"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => setFiltros({ ...filtros, categoria: value })}
          >
            <Option value="Estoque">Estoque</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Operacional">Operacional</Option>
            <Option value="Infraestrutura">Infraestrutura</Option>
            <Option value="Outros">Outros</Option>
          </Select>
          
          <DatePicker
            placeholder="Data início"
            onChange={(date) => setFiltros({ 
              ...filtros, 
              dataInicio: date?.toISOString() 
            })}
          />
          
          <DatePicker
            placeholder="Data fim"
            onChange={(date) => setFiltros({ 
              ...filtros, 
              dataFim: date?.toISOString() 
            })}
          />
        </Space>
        
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingGasto(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Novo Gasto
          </Button>
          
          <Button icon={<DownloadOutlined />}>
            Exportar CSV
          </Button>
        </Space>
      </div>

      {/* Tabela de Gastos */}
      <Table 
        columns={columns} 
        dataSource={gastos} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal de Cadastro/Edição */}
      <Modal
        title={editingGasto ? 'Editar Gasto' : 'Novo Gasto'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: 'Descrição é obrigatória' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="valor"
            label="Valor (R$)"
            rules={[{ required: true, message: 'Valor é obrigatório' }]}
          >
            <Input type="number" step="0.01" min="0" />
          </Form.Item>
          
          <Form.Item
            name="categoria"
            label="Categoria"
            rules={[{ required: true, message: 'Categoria é obrigatória' }]}
          >
            <Select>
              <Option value="Estoque">Estoque</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Operacional">Operacional</Option>
              <Option value="Infraestrutura">Infraestrutura</Option>
              <Option value="Outros">Outros</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="data"
            label="Data"
            rules={[{ required: true, message: 'Data é obrigatória' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="comprovante_url" label="URL do Comprovante">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ControleGastos;