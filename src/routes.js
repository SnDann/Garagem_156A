// src/routes.js
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/Common/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

// Lazy loading das páginas
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ClientesList = lazy(() => import('./pages/Clientes/ClientesList'));
const ClienteDetail = lazy(() => import('./pages/Clientes/ClienteDetail'));
const ClienteGaragem = lazy(() => import('./pages/Clientes/ClienteGaragem'));
const MiniaturasList = lazy(() => import('./pages/Miniaturas/MiniaturasList'));
const MiniaturaDetail = lazy(() => import('./pages/Miniaturas/MiniaturaDetail'));
const Estoque = lazy(() => import('./pages/Miniaturas/Estoque'));
const PedidosList = lazy(() => import('./pages/Pedidos/PedidosList'));
const NovoPedido = lazy(() => import('./pages/Pedidos/NovoPedido'));
const Rastreio = lazy(() => import('./pages/Pedidos/Rastreio'));
const GastosList = lazy(() => import('./pages/Gastos/GastosList'));
const Relatorios = lazy(() => import('./pages/Gastos/Relatorios'));
const WhatsAppConfig = lazy(() => import('./pages/WhatsApp/WhatsAppConfig'));
const Templates = lazy(() => import('./pages/WhatsApp/Templates'));
const Broadcast = lazy(() => import('./pages/WhatsApp/Broadcast'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Settings = lazy(() => import('./pages/Config/Settings'));
const Profile = lazy(() => import('./pages/Config/Profile'));

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Clientes */}
          <Route path="clientes" element={<ClientesList />} />
          <Route path="clientes/:id" element={<ClienteDetail />} />
          <Route path="clientes/:id/garagem" element={<ClienteGaragem />} />
          
          {/* Miniaturas */}
          <Route path="miniaturas" element={<MiniaturasList />} />
          <Route path="miniaturas/:id" element={<MiniaturaDetail />} />
          <Route path="miniaturas/estoque" element={<Estoque />} />
          
          {/* Pedidos */}
          <Route path="pedidos" element={<PedidosList />} />
          <Route path="pedidos/novo" element={<NovoPedido />} />
          <Route path="pedidos/:id" element={<PedidoDetail />} />
          <Route path="pedidos/:id/rastreio" element={<Rastreio />} />
          
          {/* Gastos */}
          <Route path="gastos" element={<GastosList />} />
          <Route path="gastos/relatorios" element={<Relatorios />} />
          
          {/* WhatsApp */}
          <Route path="whatsapp/config" element={<WhatsAppConfig />} />
          <Route path="whatsapp/templates" element={<Templates />} />
          <Route path="whatsapp/broadcast" element={<Broadcast />} />
          
          {/* Configurações */}
          <Route path="configuracoes" element={<Settings />} />
          <Route path="configuracoes/perfil" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;