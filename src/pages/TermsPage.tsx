import React from 'react';
import { motion } from 'framer-motion';

const TermsPage: React.FC = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-2 text-center">Terms of Service</h1>
        <p className="text-center text-slate-500 mb-8">Last updated: {lastUpdated}</p>
        
        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            <h3>1. Accepting these terms</h3>
            <p>By viewing or uploading anything on OG Prompts, you agree to these terms.</p>

            <h3>2. Allowed content</h3>
            <p>Only text prompts and legitimate pay-links (no malware, no phishing, no adult content where prohibited). You keep full ownership of prompts you upload; we just host them.</p>

            <h3>3. Monetization</h3>
            <p>You may insert one direct-link per prompt. We place zero fees; earnings are between you and your ad network. Clicks are counted by the third-party network—we do not guarantee revenue.</p>

            <h3>4. Prohibited use</h3>
            <p>Bots that scrape or bulk-upload, hate speech, copyright-infringing images, or anything illegal.</p>

            <h3>5. Termination</h3>
            <p>We can remove any prompt for violation of these terms, with or without notice.</p>

            <h3>6. Disclaimer</h3>
            <p>The site is provided “as is”. We are not liable for lost earnings, downtime, or prompt quality.</p>

            <h3>7. Governing law</h3>
            <p>Rajasthan, India. Any dispute will be handled in Jaipur jurisdiction.</p>

            <h3>8. Contact</h3>
            <p>Email: <a href="mailto:kumawatkartikey361@gmail.com">kumawatkartikey361@gmail.com</a> | Founders: Kartik Kumawat & Akshita</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
