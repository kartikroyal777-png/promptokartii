import React from 'react';
import AdWrapper from './AdWrapper';

const Ad160x600: React.FC = () => {
  const adKey = '88895d02f817bec688ead38e4643056c';
  const scriptSrc = `//www.highperformanceformat.com/${adKey}/invoke.js`;
  const options = {
    key: adKey,
    format: 'iframe',
    height: 600,
    width: 160,
    params: {},
  };

  return <AdWrapper options={options} scriptSrc={scriptSrc} style={{ width: '160px', height: '600px' }} />;
};

export default Ad160x600;
