// src/components/Clientes/ClienteForm.jsx
import React, { useState } from 'react';
import {
  Modal, Form, Input, Select, InputNumber,
  Row, Col, Button, Space, message
} from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import InputMask from 'react-input-mask';

const { Option } = Select;
const { TextArea } = Input;

const ClienteForm = ({ visible, onCancel, onSubmit, initialValues = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await onSubmit(values);
      message.success('Cliente salvo com sucesso!');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Erro ao salvar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Editar Cliente' : 'Novo Cliente'}
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'ativo',
          ...initialValues
        }}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="nome"
              label="Nome Completo"
              rules={[{ required: true, message: 'Nome é obrigatório' }]}
            >
              <Input placeholder="Nome do cliente" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="cpf"
              label="CPF"
            >
              <InputMask mask="999.999.999-99">
                {(inputProps) => <Input {...inputProps} placeholder="000.000.000-00" />}
              </InputMask>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                { required: true, message: 'E-mail é obrigatório' },
                { type: 'email', message: 'E-mail inválido' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="email@exemplo.com" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="telefone"
              label="Telefone/WhatsApp"
              rules={[{ required: true, message: 'Telefone é obrigatório' }]}
            >
              <InputMask mask="(99) 99999-9999">
                {(inputProps) => (
                  <Input 
                    {...inputProps} 
                    prefix={<PhoneOutlined />} 
                    placeholder="(00) 00000-0000" 
                  />
                )}
              </InputMask>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="endereco"
              label="Endereço"
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="Rua, número" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="cep"
              label="CEP"
            >
              <InputMask mask="99999-999">
                {(inputProps) => <Input {...inputProps} placeholder="00000-000" />}
              </InputMask>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="cidade"
              label="Cidade"
            >
              <Input placeholder="Cidade" />
            </Form.Item>
          </Col>
          
          <Col span={4}>
            <Form.Item
              name="estado"
              label="Estado"
            >
              <Input placeholder="UF" maxLength={2} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="status"
              label="Status"
            >
              <Select>
                <Option value="ativo">Ativo</Option>
                <Option value="inativo">Inativo</Option>
                <Option value="vip">VIP</Option>
                <Option value="bloqueado">Bloqueado</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="observacoes"
          label="Observações"
        >
          <TextArea rows={3} placeholder="Observações sobre o cliente..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClienteForm;