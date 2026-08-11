// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const { Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout className="app-layout">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      
      <AntLayout>
        <Header />
        
        <Content className="app-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
        
        <Footer />
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;