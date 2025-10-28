import React, { useRef, useEffect } from 'react';

interface AdWrapperProps {
  options: Record<string, any>;
  scriptSrc: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdWrapper: React.FC<AdWrapperProps> = ({ options, scriptSrc, style, className }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container && container.children.length === 0) {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `atOptions = ${JSON.stringify(options)};`;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc;

      container.appendChild(atOptionsScript);
      container.appendChild(script);
      
      return () => {
        if (container) {
          container.innerHTML = '';
        }
      };
    }
  }, [options, scriptSrc]);

  return <div ref={adContainerRef} style={style} className={className} />;
};

export default AdWrapper;
