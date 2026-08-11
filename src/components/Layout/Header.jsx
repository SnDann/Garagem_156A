// src/components/Layout/Header.jsx
import React from 'react';
import { Layout, Avatar, Dropdown, Badge, Space, Typography } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Meu Perfil',
        onClick: () => navigate('/configuracoes/perfil'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Configurações',
        onClick: () => navigate('/configuracoes'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sair',
        onClick: logout,
        danger: true,
      },
    ],
  };

  const notifications = [
    {
      key: '1',
      label: '📦 Pedido #123 enviado',
    },
    {
      key: '2',
      label: '⚠️ Estoque baixo: Ferrari F40',
    },
    {
      key: '3',
      label: '💬 Nova mensagem no WhatsApp',
    },
  ];

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <Space>
          <WhatsAppOutlined style={{ fontSize: 20, color: '#25D366' }} />
          <Text strong>WhatsApp Conectado</Text>
          <Badge status="success" />
        </Space>
      </div>

      <div className="header-right">
        <Space size="large">
          <Badge count={3} size="small">
            <BellOutlined className="header-icon" />
          </Badge>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space className="user-menu">
              <Avatar icon={<UserOutlined />} />
              <span className="user-name">{user?.nome || 'Admin'}</span>
            </Space>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;