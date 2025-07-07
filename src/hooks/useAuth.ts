import { useState, useEffect } from 'react';
import { authenticateUser, getCurrentUser, signOutUser } from '../lib/localStorage';

interface User {
  email: string;
  authenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = authenticateUser(email, password);
    
    if (result.success) {
      const user = getCurrentUser();
      setUser(user);
      return { data: { user }, error: null };
    } else {
      return { data: { user: null }, error: { message: result.error || 'Authentication failed' } };
    }
  };

  const signOut = async () => {
    signOutUser();
    setUser(null);
    return { error: null };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
};