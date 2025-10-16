import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Mail, Key, AlertCircle, Loader, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } else { // signup
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // New users start with 0 credits as per the new DB function
          data: {} 
        }
      });
      if (error) {
        setError(error.message);
      } else {
        toast.success('Account created! Welcome aboard.');
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center items-center p-6 md:p-12 order-2 lg:order-1">
          <div className="w-full max-w-md">
            <div className="text-left mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display">
                {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="mt-2 text-slate-600">
                {mode === 'login' ? 'Sign in to unlock your next creation.' : 'Join our community to start creating.'}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
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
                  className="w-full pl-12 pr-4 py-3 border border-light rounded-lg focus:ring-accent focus:border-accent transition"
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
                  className="w-full pl-12 pr-4 py-3 border border-light rounded-lg focus:ring-accent focus:border-accent transition"
                  placeholder="Password"
                />
              </div>
              <div>
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError(null);
                  }}
                  className="font-medium text-accent hover:underline ml-1"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col justify-center items-center bg-sky-50 p-12 order-1 lg:order-2">
            <div 
                className="w-full h-full max-w-lg aspect-square bg-contain bg-no-repeat bg-center" 
                style={{backgroundImage: 'url(https://img-wrapper.vercel.app/image?url=https://ouch-cdn2.icons8.com/vP2j2RfeW2ad65ySnk32Hk8aD3nK0k3iW5Gf2sS9JkU/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODIx/L2M0ZWE5Y2YxLWQ3/YTctNDQ2Mi1iM2Qx/LTUwYzllY2M0YmQy/MS5zdmc.png)'}}>
            </div>
            <div className="text-center max-w-md mt-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <span className="text-xl font-bold text-dark font-display">Seedream<span className="text-accent">Prompts</span></span>
                </div>
                <p className="text-slate-600">Discover thousands of AI art prompts to fuel your next masterpiece.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
