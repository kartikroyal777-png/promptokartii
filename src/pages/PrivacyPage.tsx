import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-2 text-center">Privacy Policy</h1>
        <p className="text-center text-slate-500 mb-8">Last updated: {lastUpdated}</p>
        
        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
          <h3>1. What we collect</h3>
          <ul>
            <li><strong>Uploaders:</strong> Prompt text, the URL you paste for monetization, creator name, and Instagram handle (if provided). Standard server logs like IP & browser info are also collected to prevent spam.</li>
            <li><strong>Visitors:</strong> Nothing. We use no cookies, no trackers, and no analytics. Your browsing is your business.</li>
          </ul>

          <h3>2. Why we collect it</h3>
          <p>To keep the site running, prevent spam, and display your creator credit on your prompts.</p>
          
          <h3>3. Third parties</h3>
          <p>Your pay-link (e.g., Adsterra) is embedded in your prompt's "Get Prompt" button. Their privacy policy applies after a visitor clicks that link. We do not sell, rent, or trade any of your data with anyone.</p>
          
          <h3>4. Your rights</h3>
          <p>To request deletion of a prompt you uploaded, please contact us at <a href="mailto:support@dollarprompt.com">support@dollarprompt.com</a>. We are GDPR & CCPA compliant.</p>
          
          <h3>5. Security</h3>
          <p>We use HTTPS everywhere and have security measures in place to protect the integrity of the site.</p>

          <h3>6. Changes</h3>
          <p>We’ll post updates to this policy here. Continued use of the site equals acceptance of the new terms.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
