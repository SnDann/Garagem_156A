// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, DatePicker, Select, Space, Button, message } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import MetricCard from '../../components/Dashboard/MetricCard';
import SalesChart from '../../components/Dashboard/SalesChart';
import ExpenseChart from '../../components/Dashboard/ExpenseChart';
import TopProducts from '../../components/Dashboard/TopProducts';
import RecentOrders from '../../components/Dashboard/RecentOrders';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

const Dashboard = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [visaoGeral, vendas, gastos, topProducts, recentOrders] = await Promise.all([
        api.get('/dashboard/visao-geral'),
        api.get(`/dashboard/graficos/vendas?periodo=${periodo}`),
        api.get(`/dashboard/graficos/gastos?periodo=${periodo}`),
        api.get('/dashboard/top-products'),
        api.get('/dashboard/recent-orders'),
      ]);

      setDashboardData({
        visaoGeral: visaoGeral.data,
        vendas: vendas.data,
        gastos: gastos.data,
        topProducts: topProducts.data,
        recentOrders: recentOrders.data,
      });
    } catch (error) {
      message.error('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [periodo]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <Space>
          <Select 
            value={periodo} 
            onChange={setPeriodo}
            style={{ width: 150 }}
          >
            <Option value="semana">Esta Semana</Option>
            <Option value="mes">Este Mês</Option>
            <Option value="ano">Este Ano</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={loadDashboard}>Atualizar</Button>
          <Button type="primary" icon={<DownloadOutlined />}>Exportar Relatório</Button>
        </Space>
      </div>

      {/* Métricas Principais */}
      <Row gutter={[16, 16]} className="metrics-row">
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Vendas do Período"
            value={dashboardData?.visaoGeral.valor_vendas_mes}
            prefix="R$ "
            trend={15.8}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Total de Pedidos"
            value={dashboardData?.visaoGeral.vendas_mes}
            prefix=""
            precision={0}
            trend={8.2}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Gastos do Período"
            value={dashboardData?.visaoGeral.gastos_mes}
            prefix="R$ "
            trend={-5.3}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Lucro Líquido"
            value={dashboardData?.visaoGeral.lucro_mes}
            prefix="R$ "
            trend={12.5}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <SalesChart 
            data={dashboardData?.vendas} 
            loading={loading} 
          />
        </Col>
        <Col xs={24} lg={8}>
          <ExpenseChart 
            data={dashboardData?.gastos} 
            loading={loading} 
          />
        </Col>
      </Row>

      {/* Tabelas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <TopProducts 
            products={dashboardData?.topProducts} 
            loading={loading} 
          />
        </Col>
        <Col xs={24} lg={12}>
          <RecentOrders 
            orders={dashboardData?.recentOrders} 
            loading={loading}
            onViewOrder={(id) => window.location.href = `/pedidos/${id}`}
          />
        </Col>
      </Row>

      {/* Métricas Adicionais */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <h4>🎯 Meta Mensal</h4>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{
                  width: `${(dashboardData?.visaoGeral.valor_vendas_mes / 15000) * 100}%`
                }}
              />
            </div>
            <p>R$ {dashboardData?.visaoGeral.valor_vendas_mes?.toFixed(2)} / R$ 15.000,00</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <h4>📦 Produtos Baixo Estoque</h4>
            <p className="alert-value">{dashboardData?.visaoGeral.miniaturas_baixo_estoque} itens</p>
            <Button type="link" onClick={() => window.location.href = '/miniaturas/estoque'}>
              Ver estoque →
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <h4>👥 Clientes Ativos</h4>
            <p className="success-value">{dashboardData?.visaoGeral.total_clientes}</p>
            <Button type="link" onClick={() => window.location.href = '/clientes'}>
              Ver clientes →
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;