import React from 'react';
import AdComponent from '../components/ads/AdComponent';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      
      {/* Pop-under Ad - Global */}
      <AdComponent type="script" scriptSrc="//pl27896121.effectivegatecpm.com/c3/3f/7b/c33f7bb0c23c240204543347c9879d22.js" />

      {/* Top Ad - Responsive */}
      <header className="w-full flex justify-center py-2 bg-gray-800/50">
        <div className="hidden md:block">
          <AdComponent type="options" scriptSrc="//www.highperformanceformat.com/336a43554e25b2330d93dfe8a5251632/invoke.js" options={{ key: '336a43554e25b2330d93dfe8a5251632', format: 'iframe', height: 90, width: 728, params: {} }} />
        </div>
        <div className="md:hidden">
          <AdComponent type="options" scriptSrc="//www.highperformanceformat.com/d4739fddc3b0b18e13e4968dfe7d9f01/invoke.js" options={{ key: 'd4739fddc3b0b18e13e4968dfe7d9f01', format: 'iframe', height: 50, width: 320, params: {} }} />
        </div>
      </header>

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto">
        {/* Left Sidebar Ad - Desktop only */}
        <aside className="hidden lg:block w-48 flex-shrink-0 p-4 sticky top-0 h-screen">
          <AdComponent type="options" scriptSrc="//www.highperformanceformat.com/046a12f5f7578ace4d71f8efc61ce779/invoke.js" options={{ key: '046a12f5f7578ace4d71f8efc61ce779', format: 'iframe', height: 300, width: 160, params: {} }} />
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

        {/* Right Sidebar Ad - Desktop only */}
        <aside className="hidden md:block w-80 flex-shrink-0 p-4 sticky top-0 h-screen">
          <AdComponent type="options" scriptSrc="//www.highperformanceformat.com/7722c1010eb11be53a3071d7a29b9b53/invoke.js" options={{ key: '7722c1010eb11be53a3071d7a29b9b53', format: 'iframe', height: 250, width: 300, params: {} }} />
        </aside>
      </div>

      {/* Bottom Ad / Container Ad */}
      <footer className="w-full flex flex-col items-center justify-center py-2 bg-gray-800/50 space-y-2 mt-auto">
        <div className="hidden md:block">
            <AdComponent type="options" scriptSrc="//www.highperformanceformat.com/bfd6ce59842e7a37b3d4212cfb7774d5/invoke.js" options={{ key: 'bfd6ce59842e7a37b3d4212cfb7774d5', format: 'iframe', height: 60, width: 468, params: {} }} />
        </div>
        <AdComponent type="container" scriptSrc="//pl27896144.effectivegatecpm.com/2d8c76e8f280c106b1783c3cf83024a5/invoke.js" containerId="container-2d8c76e8f280c106b1783c3cf83024a5" />
      </footer>
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;
