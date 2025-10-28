import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, UploadCloud, TrendingUp, DollarSign, Repeat, Youtube, Instagram } from 'lucide-react';
import Button from './ui/Button';

interface MonetizationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonetizationGuideModal: React.FC<MonetizationGuideModalProps> = ({ isOpen, onClose }) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } },
  };

  const steps = [
    { icon: LinkIcon, title: "Get Your Pay-Link", description: "Sign up as a PUBLISHER on Adsterra.com. Add any social URL, then create and copy your Direct Link. This is your money link.", videoUrl: "https://youtu.be/kyHnhAoaHHs" },
    { icon: UploadCloud, title: "Attach Link to Prompts", description: "When uploading a prompt on our site, paste your Direct Link into the 'Monetization URL' field before publishing." },
    { icon: TrendingUp, title: "Drive Traffic", description: "Post daily Reels and Shorts on Instagram & YouTube showing your AI art. Add 'Prompt in bio/description' and link to your monetization URL.", social: true },
    { icon: DollarSign, title: "Understand the Math", description: "Adsterra pays per 1,000 clicks (CPM). A viral Reel (50k views, 5% click-through) can earn $7-$12. Payouts are weekly from just $5." },
    { icon: Repeat, title: "Repeat & Scale", description: "Batch-create prompts, schedule your social media posts, and recycle your best content to grow your clicks and earnings." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-light">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-dark font-display">Monetization Guide</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <p className="text-slate-600 mt-1">Earn $$$ from every prompt you share.</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-dark">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    {step.videoUrl && (
                      <a href={step.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
                        <Button variant="outline" className="px-3 py-1 text-xs">
                          <Youtube className="w-4 h-4 mr-2"/> Video Guide
                        </Button>
                      </a>
                    )}
                     {step.social && (
                      <div className="flex gap-2 mt-2">
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <Youtube className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonetizationGuideModal;
