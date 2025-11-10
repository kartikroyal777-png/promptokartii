import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => void;
  signInWithPassword: typeof supabase.auth.signInWithPassword;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdminRole = useCallback(async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    // You can hardcode the admin email for simplicity or check a role from your database
    const isAdminUser = user.email === 'kartikroyal777@gmail.com';
    setIsAdmin(isAdminUser);
    
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkAdminRole(currentUser);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkAdminRole(currentUser);
      
      if (_event === 'SIGNED_IN' && currentUser?.email === 'kartikroyal777@gmail.com') {
        navigate('/admin');
      }

      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkAdminRole, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate('/');
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signOut,
    signInWithPassword: supabase.auth.signInWithPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
