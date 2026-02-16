import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { authService } from '../services/auth';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user, token } = await authService.register(name, email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const updateProfile = async (payload: {
    name?: string;
    password?: string;
  }) => {
    const user = await authService.updateProfile(payload);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
