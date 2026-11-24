import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomerChatbot } from '../common/CustomerChatbot';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-sujju-cream text-sujju-charcoal">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CustomerChatbot />
    </div>
  );
};
