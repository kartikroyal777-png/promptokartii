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
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `atOptions = ${JSON.stringify(options)};`;

      script.src = scriptSrc;

      adContainerRef.current.appendChild(atOptionsScript);
      adContainerRef.current.appendChild(script);
    }
  }, [options, scriptSrc]);

  return <div ref={adContainerRef} style={style} className={className} />;
};

export default AdWrapper;
