import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Orb from '../components/Orb';
import { Loader, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      // The onAuthStateChange in AuthContext will handle navigation
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden p-4">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] opacity-20">
        <Orb hue={240} />
      </div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] opacity-20">
        <Orb hue={280} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl shadow-accent/10"
      >
        <div className="text-center">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-7 h-7 text-accent" />
              <span className="text-2xl font-bold text-white font-display">
                OG<span className="text-accent">Prompts</span>
              </span>
            </Link>
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-gray-400">Access the OG Prompts dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-200"
              placeholder="admin@ogprompts.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full text-base font-semibold"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : 'Login'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
