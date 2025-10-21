import React, { useEffect } from 'react';

const GlobalAdScripts: React.FC = () => {
  useEffect(() => {
    // Ad Script 1 (Pop-under with container)
    const script1 = document.createElement('script');
    script1.async = true;
    script1.setAttribute('data-cfasync', 'false');
    script1.src = '//pl27896144.effectivegatecpm.com/2d8c76e8f280c106b1783c3cf83024a5/invoke.js';
    script1.id = 'global-ad-script-1';
    
    const container1 = document.createElement('div');
    container1.id = 'container-2d8c76e8f280c106b1783c3cf83024a5';
    
    document.body.appendChild(container1);
    document.body.appendChild(script1);

    // Ad Script 2 (Simple pop-under)
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '//pl27896121.effectivegatecpm.com/c3/3f/7b/c33f7bb0c23c240204543347c9879d22.js';
    script2.id = 'global-ad-script-2';
    document.body.appendChild(script2);

    return () => {
      if (document.getElementById('global-ad-script-1')) {
        document.body.removeChild(script1);
      }
      if (document.getElementById('container-2d8c76e8f280c106b1783c3cf83024a5')) {
        document.body.removeChild(container1);
      }
      if (document.getElementById('global-ad-script-2')) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  return null;
};

export default GlobalAdScripts;
