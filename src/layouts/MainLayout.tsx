import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DesktopAdSidebar from '../components/ads/DesktopAdSidebar';
import BottomNavBar from '../components/BottomNavBar';
import MonetizationModal from '../components/MonetizationModal';
import Particles from '../components/Particles';
import Orb from '../components/Orb';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const particleColors = useMemo(() => ['#38bdf8', '#ffffff', '#e2e8f0'], []);

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
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Particles
          className="absolute inset-0"
          particleCount={100}
          particleColors={particleColors}
          speed={0.05}
          particleBaseSize={1.5}
          moveParticlesOnHover={true}
          particleHoverFactor={0.2}
        />
        <div className="absolute inset-0 opacity-50">
          <Orb hue={200} hoverIntensity={0.3} />
        </div>
      </div>

      <div className="fixed top-4 left-0 right-0 z-40 px-4">
        <div className="max-w-6xl mx-auto">
          <Header onMonetizeClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      
      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto pt-24 md:pt-28 pb-28">
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
