import React, { useEffect } from 'react';

const SliderAd: React.FC = () => {
  useEffect(() => {
    const scriptId = 'video-slider-ad-script';
    
    // Prevent duplicate script injection
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = "https://js.onclckmn.com/static/onclicka.js";
    script.setAttribute('data-admpid', '381877');
    
    document.body.appendChild(script);

    return () => {
      // Cleanup on component unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null; // This component does not render any visible UI itself
};

export default SliderAd;
