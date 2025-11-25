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
        <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-6 text-center">About OG Prompts</h1>
        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
          <p>Hi! We are Kartik Kumawat & Akshita, the creators behind OG Prompts.</p>
          <p>We built OG Prompts with a simple goal: to create a high-quality, curated library of AI art prompts that anyone can use for free.</p>
          <ul>
            <li>Copy the hottest Midjourney / Stable-Diffusion prompts in one click—totally free, no sign-up required.</li>
            <li>Explore a growing collection of prompts, hand-picked for creativity and quality.</li>
          </ul>
          <p>That’s it. No subscriptions, no hidden fees, no data-selling. Just a clean, simple resource for creators.</p>
          <p>The upload feature is currently managed by our team to ensure the quality of the prompts available on the site.</p>
          <p>Questions? Drop a line at <a href="mailto:support@ogprompts.com">support@ogprompts.com</a></p>
          <p className="text-center font-semibold mt-8">Happy prompting!<br/>– Kartik & Akshita</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
