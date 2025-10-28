import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavBar from '../components/BottomNavBar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="fixed top-4 left-0 right-0 z-40 px-4">
        <Header />
      </div>
      
      <main className="flex-grow w-full max-w-7xl mx-auto pt-28 md:pt-32 pb-28 md:pb-8 px-4 md:px-6">
        {children}
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;
