'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import api from '@/lib/api';
import { isAuth } from '@/lib/auth';
import type { User, Role } from '@/lib/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (u: User | null) => void;
  can: (allowed: Role[]) => boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  setUser: () => {},
  can: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!isAuth()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const can = (allowed: Role[]) =>
    !!user && allowed.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, setUser, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}