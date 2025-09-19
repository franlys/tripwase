// src/components/layout/Layout.tsx - Layout principal
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <Breadcrumbs />
      <Navigation />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;