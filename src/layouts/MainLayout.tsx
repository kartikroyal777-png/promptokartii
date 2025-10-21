import React from 'react';
import AdComponent from '../components/ads/AdComponent';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import DesktopAdSidebar from '../components/ads/DesktopAdSidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      
      {/* Pop-under Ad - Global */}
      <AdComponent type="script" scriptSrc="//pl27896121.effectivegatecpm.com/c3/3f/7b/c33f7bb0c23c240204543347c9879d22.js" />

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto pt-16 md:pt-20">
        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>

        {/* Right Sidebar with all Desktop Ads */}
        <DesktopAdSidebar />
      </div>

      <BottomNavBar />
    </div>
  );
};

export default MainLayout;
