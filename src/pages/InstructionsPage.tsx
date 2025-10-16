import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, MousePointerClick, Image as ImageIcon, Bot, Film } from 'lucide-react';
import Button from '../components/ui/Button';

const instructions = [
  {
    icon: MousePointerClick,
    title: "Visit lmarena.ai",
    description: "Start by navigating to the lmarena.ai website in your browser.",
    color: "text-sky-500",
    bg: "bg-sky-100"
  },
  {
    icon: Bot,
    title: "Choose Direct Chat",
    description: "From the battle options at the top of the page, select 'Direct Chat' to begin.",
    color: "text-indigo-500",
    bg: "bg-indigo-100"
  },
  {
    icon: ImageIcon,
    title: "Click Image Generation",
    description: "In the prompt box, find and click on the 'Image Generation' icon.",
    color: "text-rose-500",
    bg: "bg-rose-100"
  },
  {
    icon: Sparkles,
    title: "Select Seedream Model",
    description: "From the list of available models above the prompt box, choose the 'Seedream' image model.",
    color: "text-amber-500",
    bg: "bg-amber-100"
  },
  {
    icon: Film,
    title: "Generate Your Image",
    description: "Paste your prompt from our site, hit 'Generate', and watch as AI transforms your words into a 4K cinematic image!",
    color: "text-emerald-500",
    bg: "bg-emerald-100"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark font-display mb-4">How to Use Prompts</h1>
            <p className="text-lg text-slate-600">Follow these simple steps to create your own AI images.</p>
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
                    Go to lmarena.ai
                </Button>
            </a>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructionsPage;
