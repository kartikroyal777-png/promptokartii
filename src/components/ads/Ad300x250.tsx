import React from 'react';
import AdWrapper from './AdWrapper';

const Ad300x250: React.FC = () => {
  const adKey = '7722c1010eb11be53a3071d7a29b9b53';
  const scriptSrc = `//www.highperformanceformat.com/${adKey}/invoke.js`;
  const options = {
    key: adKey,
    format: 'iframe',
    height: 250,
    width: 300,
    params: {},
  };

  return <AdWrapper options={options} scriptSrc={scriptSrc} style={{ width: '300px', height: '250px' }} />;
};

export default Ad300x250;
