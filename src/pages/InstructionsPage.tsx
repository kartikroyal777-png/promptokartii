import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MousePointerClick, Image as ImageIcon, Bot, Film, Download } from 'lucide-react';
import Button from '../components/ui/Button';

const instructions = [
  {
    icon: MousePointerClick,
    title: "Explore & Find a Prompt",
    description: "Browse our collection and click on a prompt you like to see the details.",
    color: "text-sky-500",
    bg: "bg-sky-100"
  },
  {
    icon: Sparkles,
    title: "Copy the Prompt Text",
    description: "On the prompt detail page, you'll find the full prompt text. Use the copy button to easily grab it.",
    color: "text-amber-500",
    bg: "bg-amber-100"
  },
  {
    icon: Bot,
    title: "Go to Your Favorite AI Generator",
    description: "Open your preferred AI image generation tool, like Midjourney, Stable Diffusion, or DALL-E.",
    color: "text-indigo-500",
    bg: "bg-indigo-100"
  },
  {
    icon: ImageIcon,
    title: "Paste and Generate",
    description: "Paste the copied prompt into the text box of the AI tool and generate your image.",
    color: "text-rose-500",
    bg: "bg-rose-100"
  },
  {
    icon: Film,
    title: "Enjoy Your Creation!",
    description: "Watch as the AI transforms the words into a unique, high-quality image!",
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
            <a href="/prompts">
                <Button variant="primary">
                    Explore Prompts Now
                </Button>
            </a>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructionsPage;
