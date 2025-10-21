import React, { useEffect } from 'react';

const SocialBarAd: React.FC = () => {
  useEffect(() => {
    const scriptId = 'social-bar-script';
    const containerId = 'container-2d8c76e8f280c106b1783c3cf83024a5';

    // Prevent duplicate script injection
    if (document.getElementById(scriptId) || document.getElementById(containerId)) {
      return;
    }

    const container = document.createElement('div');
    container.id = containerId;

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = 'https://pl27896144.effectivegatecpm.com/2d8c76e8f280c106b1783c3cf83024a5/invoke.js';
    
    document.body.appendChild(container);
    document.body.appendChild(script);

    return () => {
      // Cleanup on component unmount
      const existingContainer = document.getElementById(containerId);
      if (existingContainer && existingContainer.parentElement === document.body) {
        document.body.removeChild(existingContainer);
      }
      const existingScript = document.getElementById(scriptId);
      if (existingScript && existingScript.parentElement === document.body) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null; // This component does not render anything itself
};

export default SocialBarAd;
