import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DesktopAdSidebar from '../components/ads/DesktopAdSidebar';
import BottomNavBar from '../components/BottomNavBar';
import MonetizationModal from '../components/MonetizationModal';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenMonetizationModal');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        localStorage.setItem('hasSeenMonetizationModal', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
        <Header onMonetizeClick={() => setIsModalOpen(true)} />
      </div>
      
      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto pt-24 md:pt-28 pb-24 md:pb-8">
        <main className="flex-grow p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>
        <DesktopAdSidebar />
      </div>

      <Footer />
      <BottomNavBar onMonetizeClick={() => setIsModalOpen(true)} />
      <MonetizationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MainLayout;
