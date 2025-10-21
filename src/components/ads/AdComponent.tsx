import React, { useEffect, useRef } from 'react';

type AdOptions = {
  key: string;
  format: string;
  height: number;
  width: number;
  params: Record<string, unknown>;
};

type AdComponentProps = 
  | { type: 'options'; scriptSrc: string; options: AdOptions }
  | { type: 'container'; scriptSrc: string; containerId: string }
  | { type: 'script'; scriptSrc: string };

const AdComponent: React.FC<AdComponentProps> = (props) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!adRef.current || isLoaded.current) return;

    const container = adRef.current;
    
    // Clear previous ad content if any
    container.innerHTML = '';

    const script = document.createElement('script');

    if (props.type === 'options') {
      script.type = 'text/javascript';
      // Using a function to set the global variable to avoid strict mode issues
      const setOptionsScript = document.createElement('script');
      setOptionsScript.innerHTML = `window.atOptions = ${JSON.stringify(props.options)};`;
      container.appendChild(setOptionsScript);

      const externalScript = document.createElement('script');
      externalScript.type = 'text/javascript';
      // Ensure protocol is present
      externalScript.src = props.scriptSrc.startsWith('//') ? `https:${props.scriptSrc}` : props.scriptSrc;
      container.appendChild(externalScript);

    } else if (props.type === 'container') {
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = props.scriptSrc.startsWith('//') ? `https:${props.scriptSrc}` : props.scriptSrc;
      
      const adContainer = document.createElement('div');
      adContainer.id = props.containerId;
      container.appendChild(adContainer);
      container.appendChild(script);

    } else if (props.type === 'script') {
      script.type = 'text/javascript';
      script.src = props.scriptSrc.startsWith('//') ? `https:${props.scriptSrc}` : props.scriptSrc;
      container.appendChild(script);
    }
    
    isLoaded.current = true;

  }, [props]);

  return <div ref={adRef} className="flex justify-center items-center" />;
};

export default AdComponent;
