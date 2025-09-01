import { useState, useEffect } from 'react';
import { authAPI } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  token?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      // Verify token is still valid
      authAPI.getUser(storedToken)
        .then(({ user, error }) => {
          if (error) {
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
            setUser(null);
          } else {
            setUser({ ...JSON.parse(storedUser), token: storedToken });
          }
        })
        .catch(() => {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          setUser(null);
        });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authAPI.signIn(email, password);
      
      if (result.error) {
        return { data: null, error: { message: result.error } };
      }
      
      if (result.user && result.session) {
        const userData = {
          id: result.user.id,
          email: result.user.email,
          token: result.session.access_token
        };
        
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('auth_token', result.session.access_token);
        
        return { data: { user: userData }, error: null };
      } else {
        return { data: null, error: { message: 'Authentication failed' } };
      }
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.signOut();
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign out failed' } };
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
};