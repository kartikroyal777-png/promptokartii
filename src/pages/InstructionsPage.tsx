import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Image as ImageIcon, Sparkles, CheckSquare, List } from 'lucide-react';
import Button from '../components/ui/Button';

const instructions = [
  {
    icon: Bot,
    title: "Visit Luma AI Arena",
    description: "Navigate to lmarena.ai in your web browser.",
    color: "text-sky-500",
    bg: "bg-sky-100"
  },
  {
    icon: List,
    title: "Choose Direct Chat",
    description: "From the options at the top, select 'Direct Chat' to start a one-on-one session with the AI.",
    color: "text-indigo-500",
    bg: "bg-indigo-100"
  },
  {
    icon: ImageIcon,
    title: "Select Image Generation",
    description: "Click the image icon inside the prompt box to switch to image generation mode.",
    color: "text-amber-500",
    bg: "bg-amber-100"
  },
  {
    icon: CheckSquare,
    title: "Pick the Seedream Model",
    description: "From the list of available models above the prompt box, find and select 'Seedream'.",
    color: "text-rose-500",
    bg: "bg-rose-100"
  },
  {
    icon: Sparkles,
    title: "Paste, Generate & Enjoy!",
    description: "Paste your prompt, hit Generate, and watch as the AI transforms your words into a 4K cinematic masterpiece.",
    color: "text-emerald-500",
    bg: "bg-emerald-100"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const InstructionsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10"
      >
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark font-display mb-4">How to Create with Seedream</h1>
            <p className="text-lg text-slate-600">Follow these simple steps to generate your own images for free.</p>
        </div>

        <motion.div 
            className="max-w-2xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {instructions.map((step, index) => (
            <motion.div 
                key={index} 
                className="flex items-start gap-6"
                variants={itemVariants}
            >
              <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${step.bg}`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark mb-1">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
            <a href="https://lmarena.ai" target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                    Go to Luma Arena
                </Button>
            </a>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructionsPage;
