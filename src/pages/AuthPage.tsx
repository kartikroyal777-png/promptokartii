import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Key, AlertCircle, Loader, User, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Orb from '../components/Orb';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      toast.success('Logged in successfully!');
      // Navigation is handled by onAuthStateChange in AuthContext
      // but we can keep this as a fallback.
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Orb hue={200} />
      </div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 opacity-30">
        <Orb hue={240} />
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-30">
        <Orb hue={280} />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-dark/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl shadow-accent/10">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-7 h-7 text-accent" />
              <span className="text-2xl font-bold text-white font-display">
                OG<span className="text-accent">Prompts</span>
              </span>
            </Link>
            <h1 className="text-3xl font-extrabold flex items-center justify-center gap-3">
              <User /> Admin Login
            </h1>
            <p className="mt-2 text-slate-400">
              Please enter your admin credentials to continue.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-accent focus:border-accent transition"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-accent focus:border-accent transition"
                placeholder="Password"
              />
            </div>
            <div>
              <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                {loading ? (
                  <Loader className="animate-spin" />
                ) : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
