import { useState, useEffect } from 'react';
import { authenticateUser, getCurrentUser, signOutUser } from '../lib/localStorage';

// Local User type since we're not using Supabase
interface User {
  id: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = authenticateUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return { data: { user: result.user }, error: null };
      } else {
        return { data: null, error: { message: result.error || 'Authentication failed' } };
      }
    } catch (error) {
      return { data: null, error: { message: 'Authentication failed' } };
    }
  };

  const signOut = async () => {
    try {
      signOutUser();
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