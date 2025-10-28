import React from 'react';
import AdComponent from './AdComponent';

const DesktopAdSidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-80 flex-shrink-0 p-4 sticky top-28 h-[calc(100vh-13rem)]">
      <div className="flex flex-col items-center justify-around gap-6 h-full overflow-y-auto rounded-lg bg-white/50 p-4 border border-light">
        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Advertisement</h3>
        
        <div className="min-h-[250px] w-full flex items-center justify-center">
            <AdComponent 
            type="options" 
            scriptSrc="//www.highperformanceformat.com/7722c1010eb11be53a3071d7a29b9b53/invoke.js" 
            options={{ key: '7722c1010eb11be53a3071d7a29b9b53', format: 'iframe', height: 250, width: 300, params: {} }} 
            />
        </div>
        
        <div className="min-h-[300px] w-full flex items-center justify-center">
            <AdComponent 
            type="options" 
            scriptSrc="//www.highperformanceformat.com/046a12f5f7578ace4d71f8efc61ce779/invoke.js" 
            options={{ key: '046a12f5f7578ace4d71f8efc61ce779', format: 'iframe', height: 300, width: 160, params: {} }} 
            />
        </div>
        
        <div className="min-h-[60px] w-full flex items-center justify-center">
            <AdComponent 
            type="options" 
            scriptSrc="//www.highperformanceformat.com/bfd6ce59842e7a37b3d4212cfb7774d5/invoke.js" 
            options={{ key: 'bfd6ce59842e7a37b3d4212cfb7774d5', format: 'iframe', height: 60, width: 468, params: {} }} 
            />
        </div>

        <div className="min-h-[90px] w-full flex items-center justify-center">
            <AdComponent 
            type="options" 
            scriptSrc="//www.highperformanceformat.com/336a43554e25b2330d93dfe8a5251632/invoke.js" 
            options={{ key: '336a43554e25b2330d93dfe8a5251632', format: 'iframe', height: 90, width: 728, params: {} }} 
            />
        </div>
        
        <div className="text-center text-xs text-slate-400 p-2">
            Ads help keep DollarPrompt free.
        </div>
      </div>
    </aside>
  );
};

export default DesktopAdSidebar;
