// src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  WhatsAppOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import './Sidebar.css';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/clientes',
    icon: <TeamOutlined />,
    label: 'Clientes',
  },
  {
    key: '/miniaturas',
    icon: <CarOutlined />,
    label: 'Miniaturas',
    children: [
      {
        key: '/miniaturas/lista',
        label: 'Lista',
      },
      {
        key: '/miniaturas/estoque',
        label: 'Estoque',
      },
    ],
  },
  {
    key: '/pedidos',
    icon: <ShoppingCartOutlined />,
    label: 'Pedidos',
  },
  {
    key: '/gastos',
    icon: <DollarOutlined />,
    label: 'Gastos',
  },
  {
    key: '/whatsapp',
    icon: <WhatsAppOutlined />,
    label: 'WhatsApp',
    children: [
      {
        key: '/whatsapp/config',
        label: 'Configuração',
      },
      {
        key: '/whatsapp/templates',
        label: 'Templates',
      },
      {
        key: '/whatsapp/broadcast',
        label: 'Broadcast',
      },
    ],
  },
  {
    key: '/configuracoes',
    icon: <SettingOutlined />,
    label: 'Configurações',
  },
];

const Sidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="sidebar"
      width={250}
    >
      <div className="sidebar-header">
        <CarOutlined className="logo-icon" />
        {!collapsed && <h1 className="logo-text">Garagem 156A</h1>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['/miniaturas', '/whatsapp']}
        items={menuItems}
        onClick={({ key }) => {
          // Navegação será feita pelo Link do React Router
        }}
      />

      <div className="sidebar-footer">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          className="collapse-btn"
        />
      </div>
    </Sider>
  );
};

export default Sidebar;