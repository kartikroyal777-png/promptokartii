import React from 'react';
import { motion } from 'framer-motion';
import Ad320x50 from './Ad320x50';
import Ad300x250 from './Ad300x250';

const MobileAdBanners: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 my-6"
    >
      <div className="md:hidden">
        <Ad320x50 />
      </div>
      <Ad300x250 />
    </motion.div>
  );
};

export default MobileAdBanners;
