import React from 'react';
import Ad160x600 from './Ad160x600';
import Ad300x250 from './Ad300x250';
import Ad160x300 from './Ad160x300';

const DesktopAdSidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-80 flex-shrink-0 p-4 sticky top-28 h-[calc(100vh-13rem)]">
      <div className="flex flex-col items-center justify-start gap-6 h-full overflow-y-auto rounded-lg bg-white/50 p-4 border border-light">
        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Advertisement</h3>
        
        <div className="min-h-[250px] w-full flex items-center justify-center">
          <Ad300x250 />
        </div>
        
        <div className="min-h-[300px] w-full flex items-center justify-center">
          <Ad160x300 />
        </div>

        <div className="min-h-[600px] w-full flex items-center justify-center">
          <Ad160x600 />
        </div>
        
        <div className="text-center text-xs text-slate-400 p-2 mt-auto">
            Ads help keep OG Prompts free.
        </div>
      </div>
    </aside>
  );
};

export default DesktopAdSidebar;
