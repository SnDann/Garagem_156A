// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [periodo]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [visaoGeral, graficoVendas] = await Promise.all([
        api.get('/dashboard/visao-geral'),
        api.get(`/dashboard/graficos/vendas?periodo=${periodo}`)
      ]);
      setData({
        visaoGeral: visaoGeral.data,
        graficoVendas: graficoVendas.data
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard - Garagem 156A</h1>
      
      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>💰 Vendas do Mês</h3>
          <p className="metric-value">
            R$ {data?.visaoGeral.valor_vendas_mes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </p>
        </div>
        
        <div className="metric-card">
          <h3>📦 Pedidos</h3>
          <p className="metric-value">{data?.visaoGeral.vendas_mes}</p>
        </div>
        
        <div className="metric-card">
          <h3>👥 Clientes</h3>
          <p className="metric-value">{data?.visaoGeral.total_clientes}</p>
        </div>
        
        <div className="metric-card">
          <h3>🏎️ Miniaturas</h3>
          <p className="metric-value">{data?.visaoGeral.total_estoque}</p>
        </div>
        
        <div className="metric-card alert">
          <h3>⚠️ Baixo Estoque</h3>
          <p className="metric-value">{data?.visaoGeral.miniaturas_baixo_estoque}</p>
        </div>
        
        <div className="metric-card">
          <h3>💸 Gastos</h3>
          <p className="metric-value">
            R$ {data?.visaoGeral.gastos_mes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-container">
          <h2>📈 Vendas por Período</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.graficoVendas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#8884d8" name="Valor (R$)" />
              <Line type="monotone" dataKey="quantidade" stroke="#82ca9d" name="Quantidade" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>🎯 Meta de Vendas</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{
                  width: `${(data?.visaoGeral.valor_vendas_mes / 10000) * 100}%`
                }}
              ></div>
            </div>
            <p>
              R$ {data?.visaoGeral.valor_vendas_mes.toLocaleString('pt-BR')} 
              de R$ 10.000,00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;