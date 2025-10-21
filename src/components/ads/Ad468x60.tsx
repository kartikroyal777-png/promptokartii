import React from 'react';
import AdWrapper from './AdWrapper';

const Ad468x60: React.FC = () => {
  const adKey = 'bfd6ce59842e7a37b3d4212cfb7774d5';
  const scriptSrc = `//www.highperformanceformat.com/${adKey}/invoke.js`;
  const options = {
    key: adKey,
    format: 'iframe',
    height: 60,
    width: 468,
    params: {},
  };

  return <AdWrapper options={options} scriptSrc={scriptSrc} style={{ width: '468px', height: '60px' }} />;
};

export default Ad468x60;
