import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px 20px 40px' }}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
