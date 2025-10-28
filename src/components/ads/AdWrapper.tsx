import React, { useRef, useEffect } from 'react';

interface AdWrapperProps {
  options: Record<string, any>;
  scriptSrc: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdWrapper: React.FC<AdWrapperProps> = ({ options, scriptSrc, style, className }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const iframeId = useRef(`ad-iframe-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clean up previous iframe if it exists
    container.innerHTML = '';

    const adIframe = document.createElement('iframe');
    adIframe.id = iframeId;
    adIframe.setAttribute('frameborder', '0');
    adIframe.setAttribute('scrolling', 'no');
    adIframe.style.width = style?.width?.toString() || '100%';
    adIframe.style.height = style?.height?.toString() || '100%';
    adIframe.style.border = '0';
    adIframe.style.overflow = 'hidden';

    container.appendChild(adIframe);

    const iframeDoc = adIframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
            <html>
            <head>
                <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }</style>
            </head>
            <body>
                <script type="text/javascript">
                    atOptions = ${JSON.stringify(options)};
                <\/script>
                <script type="text/javascript" src="https:${scriptSrc}"><\/script>
            </body>
            </html>
        `);
        iframeDoc.close();
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [options, scriptSrc, style, iframeId]);

  return <div ref={adContainerRef} style={style} className={className} />;
};

export default AdWrapper;
