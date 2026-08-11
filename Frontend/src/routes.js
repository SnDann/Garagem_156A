import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/Dashboard';
import ClientesList from './pages/Clientes/ClientesList';
import MiniaturasList from './pages/Miniaturas/MiniaturasList';
import PedidosList from './pages/Pedidos/PedidosList';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/miniaturas" element={<MiniaturasList />} />
        <Route path="/pedidos" element={<PedidosList />} />
      </Routes>
    </Router>
  );
}
