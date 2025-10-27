import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-6 text-center">About DollarPrompt</h1>
        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
          <p>Hi! I’m Kartik Kumawat, solo developer and AI-image nut.</p>
          <p>I built DollarPrompt to give everyone two dead-simple things:</p>
          <ul>
            <li>Copy the hottest Midjourney / Stable-Diffusion prompts in one click—totally free, no sign-up.</li>
            <li>Upload your own prompts and attach an Adsterra Direct-Link (or any pay-link). When visitors click, you earn $0.50-$5 per 1,000 clicks—we take a <strong className="text-accent">0% cut</strong>.</li>
          </ul>
          <p>That’s it. No subscriptions, no hidden fees, no data-selling.</p>
          <p>Questions? Drop a line at <a href="mailto:support@dollarprompt.com">support@dollarprompt.com</a></p>
          <p className="text-center font-semibold mt-8">Happy prompting!<br/>– Kartik</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
