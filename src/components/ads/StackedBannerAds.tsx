import React from 'react';
import AdComponent from './AdComponent';

const StackedBannerAds: React.FC = () => {
  return (
    // This container is now hidden on medium screens and up, making it mobile-only.
    <div className="flex flex-col items-center gap-4 my-6 md:my-8 md:hidden">
      {/* Mobile Banner 1 */}
      <AdComponent 
        type="options" 
        scriptSrc="//www.highperformanceformat.com/d4739fddc3b0b18e13e4968dfe7d9f01/invoke.js" 
        options={{ key: 'd4739fddc3b0b18e13e4968dfe7d9f01', format: 'iframe', height: 50, width: 320, params: {} }} 
      />

      {/* Mobile Banner 2 */}
      <AdComponent 
        type="options" 
        scriptSrc="//www.highperformanceformat.com/7722c1010eb11be53a3071d7a29b9b53/invoke.js" 
        options={{ key: '7722c1010eb11be53a3071d7a29b9b53', format: 'iframe', height: 250, width: 300, params: {} }} 
      />
    </div>
  );
};

export default StackedBannerAds;
