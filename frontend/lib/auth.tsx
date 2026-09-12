'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Character } from '../types';
import { apiRequest, getStoredToken, setStoredToken } from './api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  character: Character | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string, confirmPass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshCharacter: () => Promise<void>;
  updateCharacterState: (character: Character) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchSession = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    const res = await apiRequest<{ user: User; character: Character }>('/auth/me');

    if (res.success && res.data) {
      setUser(res.data.user);
      setCharacter(res.data.character);
    } else {
      setStoredToken(null);
      setToken(null);
      setUser(null);
      setCharacter(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await apiRequest<{ token: string; user: User; character: Character }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCharacter(res.data.character);
      setLoading(false);
      router.push('/dashboard');
      return { success: true };
    } else {
      setLoading(false);
      return {
        success: false,
        message: res.error?.message || 'Login failed. Please verify credentials.',
      };
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    const res = await apiRequest<{ token: string; user: User; character: Character }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCharacter(res.data.character);
      setLoading(false);
      router.push('/dashboard');
      return { success: true };
    } else {
      setLoading(false);
      return {
        success: false,
        message: res.error?.message || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setCharacter(null);
    router.push('/login');
  };

  const refreshCharacter = async () => {
    if (!token) return;
    const res = await apiRequest<Character>('/character');
    if (res.success && res.data) {
      setCharacter(res.data);
    }
  };

  const updateCharacterState = (newCharacter: Character) => {
    setCharacter(newCharacter);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        character,
        token,
        loading,
        login,
        register,
        logout,
        refreshCharacter,
        updateCharacterState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
