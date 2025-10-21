import React from 'react';
import AdComponent from './AdComponent';

const DesktopAdSidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-80 flex-shrink-0 p-4 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex flex-col items-center gap-6">
        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Advertisement</h3>
        
        {/* Ad 1: 300x250 */}
        <AdComponent 
          type="options" 
          scriptSrc="//www.highperformanceformat.com/7722c1010eb11be53a3071d7a29b9b53/invoke.js" 
          options={{ key: '7722c1010eb11be53a3071d7a29b9b53', format: 'iframe', height: 250, width: 300, params: {} }} 
        />
        
        {/* Ad 2: 160x300 */}
        <AdComponent 
          type="options" 
          scriptSrc="//www.highperformanceformat.com/046a12f5f7578ace4d71f8efc61ce779/invoke.js" 
          options={{ key: '046a12f5f7578ace4d71f8efc61ce779', format: 'iframe', height: 300, width: 160, params: {} }} 
        />
        
        {/* Ad 3: 320x50 */}
        <AdComponent 
          type="options" 
          scriptSrc="//www.highperformanceformat.com/d4739fddc3b0b18e13e4968dfe7d9f01/invoke.js" 
          options={{ key: 'd4739fddc3b0b18e13e4968dfe7d9f01', format: 'iframe', height: 50, width: 320, params: {} }} 
        />
        
        {/* Note: The 728x90 and 468x60 ads are too wide for a vertical sidebar and are now hidden on desktop. */}
      </div>
    </aside>
  );
};

export default DesktopAdSidebar;
