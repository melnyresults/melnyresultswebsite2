import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'admin'
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Input sanitization
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedEmail || !password) {
        return { data: null, error: { message: 'Email and password are required' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });
      
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin'
        };
        
        setUser(userData);
        return { data: { user: userData }, error: null };
      } else {
        return { data: null, error: { message: 'Authentication failed' } };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: 'Network error or invalid credentials' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      
      // Clear any cached data
      localStorage.removeItem('blog_draft');
      
      return { error: error ? { message: error.message } : null };
    } catch (error) {
      setUser(null);
      localStorage.removeItem('blog_draft');
      return { error: null };
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
};