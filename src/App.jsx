// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './styles/global.css';

const App = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <AuthProvider>
          <AppProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AppProvider>
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;