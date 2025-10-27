import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonetizationModal: React.FC<MonetizationModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-dark transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark font-display mb-2">🚀 Mini-Guide: Earn $$$</h2>
            <p className="text-slate-600 mb-6">From every prompt you share with <strong className="text-accent bg-accent/10 px-2 py-1 rounded-md">0% commission</strong></p>

            <div className="space-y-6 text-slate-700">
              <Step number={1} title="Get Your Monetization Link">
                <p>Sign up as a <strong className="font-semibold text-dark">PUBLISHER</strong> on a platform like Adsterra. It's free and takes minutes.</p>
                <p>In your dashboard, create a "Direct Link". This is your personal money link.</p>
                <a href="https://youtu.be/kyHnhAoaHHs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:underline mt-2">
                  Video Guide <ExternalLink size={14} />
                </a>
              </Step>

              <Step number={2} title="Attach Link to Your Prompts">
                <p>When you <a href="/upload" className="text-accent font-semibold hover:underline">upload a prompt</a> on DollarPrompt, paste your Adsterra Direct Link into the “Monetization URL” field.</p>
                <p>Now, every time someone clicks to get your prompt, they'll see a quick ad, and you'll earn money.</p>
              </Step>

              <Step number={3} title="Drive Traffic (Optional, but recommended)">
                <p>Share your AI art on Instagram, TikTok, or YouTube Shorts. In your post, tell people "Prompt in bio!"</p>
                <p>Put your Adsterra link in your social media bio. More clicks = more earnings.</p>
                <p className="text-sm text-slate-500 mt-2">Popular hashtags: <code className="bg-slate-100 p-1 rounded">#AIPrompt</code> <code className="bg-slate-100 p-1 rounded">#MidjourneyPrompt</code> <code className="bg-slate-100 p-1 rounded">#StableDiffusion</code></p>
              </Step>

              <Step number={4} title="Watch Your Earnings Grow">
                <p>Adsterra pays for every 1,000 views/clicks (CPM). A single viral video can earn you $5-$15+.</p>
                <p>Withdraw your earnings weekly via PayPal, Bitcoin, or Wire Transfer (from $5).</p>
                <p className="mt-2">Check your stats, analyze what works, and scale up!</p>
              </Step>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Step = ({ number, title, children }: { number: number, title: string, children: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center">{number}</div>
    <div>
      <h3 className="font-bold text-dark text-lg mb-1">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  </div>
);

export default MonetizationModal;
