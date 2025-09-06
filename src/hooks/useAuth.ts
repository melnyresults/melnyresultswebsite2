import { useState, useEffect } from 'react';
import { supabaseUrl } from '../lib/supabase';

// Secure auth API calls
const AUTH_API_URL = `${supabaseUrl}/functions/v1/auth`;

const authAPI = {
  signIn: async (email: string, password: string) => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, action: 'signIn' })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    return response.json();
  },

  signOut: async () => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'signOut' })
    });
    return response.json();
  },

  getUser: async (token: string) => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'getUser' })
    });
    
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    
    return response.json();
  }
};

interface User {
  id: string;
  email: string;
  token?: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session with validation
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Verify token is still valid
        authAPI.getUser(storedToken)
          .then(({ user, error }) => {
            if (error || !user) {
              clearAuthData();
              setUser(null);
            } else {
              // Validate user data structure
              if (user.id && user.email) {
                setUser({ ...parsedUser, token: storedToken });
              } else {
                clearAuthData();
                setUser(null);
              }
            }
          })
          .catch(() => {
            clearAuthData();
            setUser(null);
          });
      } catch (error) {
        // Invalid stored data
        clearAuthData();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    // Clear any other sensitive data
    localStorage.removeItem('blog_draft');
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Input sanitization
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedEmail || !password) {
        return { data: null, error: { message: 'Email and password are required' } };
      }

      const result = await authAPI.signIn(sanitizedEmail, password);
      
      if (result.error) {
        return { data: null, error: { message: result.error } };
      }
      
      if (result.user && result.session) {
        const userData = {
          id: result.user.id,
          email: result.user.email,
          token: result.session.access_token,
          role: result.user.role || 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('auth_token', result.session.access_token);
        
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
      await authAPI.signOut();
      clearAuthData();
      setUser(null);
      return { error: null };
    } catch (error) {
      // Even if API call fails, clear local data
      clearAuthData();
      setUser(null);
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