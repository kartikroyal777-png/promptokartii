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

  const { type } = props;
  const scriptSrc = 'scriptSrc' in props ? props.scriptSrc : undefined;
  const optionsString = 'options' in props ? JSON.stringify(props.options) : undefined;
  const containerId = 'containerId' in props ? props.containerId : undefined;

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    // Clear previous content to prevent duplicates
    container.innerHTML = '';

    const elements: HTMLElement[] = [];
    const options = optionsString ? JSON.parse(optionsString) : undefined;

    if (type === 'options' && scriptSrc && options) {
      const setOptionsScript = document.createElement('script');
      setOptionsScript.innerHTML = `window.atOptions = ${JSON.stringify(options)};`;
      container.appendChild(setOptionsScript);
      elements.push(setOptionsScript);

      const externalScript = document.createElement('script');
      externalScript.type = 'text/javascript';
      externalScript.src = scriptSrc.startsWith('//') ? `https:${scriptSrc}` : scriptSrc;
      container.appendChild(externalScript);
      elements.push(externalScript);

    } else if (type === 'container' && scriptSrc && containerId) {
      const adContainer = document.createElement('div');
      adContainer.id = containerId;
      container.appendChild(adContainer);
      elements.push(adContainer);

      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = scriptSrc.startsWith('//') ? `https:${scriptSrc}` : scriptSrc;
      container.appendChild(script);
      elements.push(script);

    } else if (type === 'script' && scriptSrc) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc.startsWith('//') ? `https:${scriptSrc}` : scriptSrc;
      container.appendChild(script);
      elements.push(script);
    }
    
    return () => {
        // Cleanup function to remove all created elements
        elements.forEach(el => {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, scriptSrc, optionsString, containerId]);

  return <div ref={adRef} className="flex justify-center items-center" />;
};

export default AdComponent;
