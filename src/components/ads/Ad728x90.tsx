import React from 'react';
import AdWrapper from './AdWrapper';

const Ad728x90: React.FC = () => {
  const adKey = '336a43554e25b2330d93dfe8a5251632';
  const scriptSrc = `//www.highperformanceformat.com/${adKey}/invoke.js`;
  const options = {
    key: adKey,
    format: 'iframe',
    height: 90,
    width: 728,
    params: {},
  };

  return <AdWrapper options={options} scriptSrc={scriptSrc} style={{ width: '728px', height: '90px' }} />;
};

export default Ad728x90;
