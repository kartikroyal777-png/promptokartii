import React from 'react';
import AdWrapper from './AdWrapper';

const Ad160x300: React.FC = () => {
  const adKey = '046a12f5f7578ace4d71f8efc61ce779';
  const scriptSrc = `//www.highperformanceformat.com/${adKey}/invoke.js`;
  const options = {
    key: adKey,
    format: 'iframe',
    height: 300,
    width: 160,
    params: {},
  };

  return <AdWrapper options={options} scriptSrc={scriptSrc} style={{ width: '160px', height: '300px' }} />;
};

export default Ad160x300;
