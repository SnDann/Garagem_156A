import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import LuxuryPanelCard from '../../components/Common/LuxuryPanelCard';
import KpiTrendCard from '../../components/Common/KpiTrendCard';
import DashboardCharts from '../../components/Common/DashboardCharts';
import FigmaReference from '../../components/Common/FigmaReference';
import { listClientes, listMiniaturas, listPedidos, listGastos } from '../../services/api';

const metricMeta = [
  { key: 'clientes', title: 'Clientes', icon: '👤', trend: 12, subtitle: 'Novos clientes este mês' },
  { key: 'miniaturas', title: 'Miniaturas', icon: '🧩', trend: 8, subtitle: 'Estoque em destaque' },
  { key: 'pedidos', title: 'Pedidos', icon: '🧾', trend: 15, subtitle: 'Operações em andamento' },
  { key: 'gastos', title: 'Gastos', icon: '💸', trend: -3, subtitle: 'Controle financeiro' },
];

export default function DashboardPage() {
  const [clientes, setClientes] = useState([]);
  const [miniaturas, setMiniaturas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [clientesData, miniaturasData, pedidosData, gastosData] = await Promise.all([
          listClientes(),
          listMiniaturas(),
          listPedidos(),
          listGastos(),
        ]);
        setClientes(clientesData);
        setMiniaturas(miniaturasData);
        setPedidos(pedidosData);
        setGastos(gastosData);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const metrics = {
    clientes: clientes.length,
    miniaturas: miniaturas.length,
    pedidos: pedidos.length,
    gastos: gastos.length,
  };

  return (
    <Layout>
      <div className="page-card">
        <div className="page-header">
          <div>
            <h2 className="page-title">Painel principal</h2>
            <p className="page-subtitle">Resumo rápido do seu negócio com uma visão mais premium.</p>
          </div>
        </div>

        {loading ? <p>Carregando dados...</p> : (
          <div className="metric-grid" style={{ marginBottom: 18 }}>
            {metricMeta.map((item) => (
              <KpiTrendCard
                key={item.key}
                title={item.title}
                value={metrics[item.key]}
                subtitle={item.subtitle}
                icon={item.icon}
                trend={item.trend}
                accent={item.key === 'gastos' ? 'success' : 'primary'}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          <LuxuryPanelCard title="Resumo de vendas" subtitle="Visão executiva e estratégica do movimento do negócio">
            <DashboardCharts pedidos={pedidos} clientes={clientes} gastos={gastos} />
          </LuxuryPanelCard>

          <LuxuryPanelCard title="Performance operacional" subtitle="Estrutura visual pronta para dashboards de gestão" accent="success">
            <p style={{ color: '#94a3b8', marginBottom: 0 }}>A arquitetura visual foi organizada para parecer um painel comercial moderno, com foco em clareza, ritmo e sofisticação.</p>
          </LuxuryPanelCard>

          <FigmaReference />
        </div>
      </div>
    </Layout>
  );
}
