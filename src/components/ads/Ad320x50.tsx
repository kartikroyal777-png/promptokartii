import React from 'react';
import AdWrapper from './AdWrapper';

const Ad320x50: React.FC = () => {
  const adKey = 'd4739fddc3b0b18e13e4968dfe7d9f01';
  const scriptSrc = `//www.highperformanceformat.com/${adKey}/invoke.js`;
  const options = {
    key: adKey,
    format: 'iframe',
    height: 50,
    width: 320,
    params: {},
  };

  return <AdWrapper options={options} scriptSrc={scriptSrc} style={{ width: '320px', height: '50px' }} />;
};

export default Ad320x50;
