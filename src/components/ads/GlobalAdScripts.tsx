import React, { useEffect } from 'react';

const GlobalAdScripts: React.FC = () => {
  useEffect(() => {
    const scripts = [
      // Pop-under
      { type: 'script', src: '//pl27896121.effectivegatecpm.com/c3/3f/7b/c33f7bb0c23c240204543347c9879d22.js' },
      // Social Bar / Container-based
      { type: 'container', src: '//pl27896144.effectivegatecpm.com/2d8c76e8f280c106b1783c3cf83024a5/invoke.js', containerId: 'container-2d8c76e8f280c106b1783c3cf83024a5' },
    ];

    const loadedElements: HTMLElement[] = [];

    scripts.forEach((scriptInfo, index) => {
      const scriptId = `global-ad-script-${index}`;
      if (document.getElementById(scriptId)) return;

      let container: HTMLDivElement | null = null;
      if (scriptInfo.type === 'container' && scriptInfo.containerId) {
        if (document.getElementById(scriptInfo.containerId)) return;
        container = document.createElement('div');
        container.id = scriptInfo.containerId;
        document.body.appendChild(container);
        loadedElements.push(container);
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptInfo.src;
      
      document.body.appendChild(script);
      loadedElements.push(script);
    });

    return () => {
      loadedElements.forEach(element => {
        if (element.parentElement === document.body) {
          document.body.removeChild(element);
        }
      });
    };
  }, []);

  return null;
};

export default GlobalAdScripts;
