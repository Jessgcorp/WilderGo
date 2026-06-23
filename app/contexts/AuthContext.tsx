import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email?: string;
  [k: string]: any;
};

type SignInResult = { success: boolean; message?: string; user?: User };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
};

const STORAGE_KEY = 'WILDERGO_USER_V1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from storage on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch (e) {
        // On any error, ensure we do not leave the app in a limbo state.
        console.warn('AuthProvider: failed to load user from storage', e);
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Robust signIn: returns { success } and never throws to callers
  async function signIn(email: string, password: string): Promise<SignInResult> {
    try {
      // TODO: replace with real auth call to your backend
      // Simulated network call
      await new Promise((r) => setTimeout(r, 600));
      // Example success condition: password === 'password' (DEV only)
      if (!email) return { success: false, message: 'Missing email' };
      if (!password) return { success: false, message: 'Missing password' };

      // In production, replace with API result
      const fakeUser: User = { id: String(Date.now()), email };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser));
      setUser(fakeUser);
      return { success: true, user: fakeUser };
    } catch (e) {
      console.warn('AuthProvider: signIn failed', e);
      // On any error, set user to null and return failure object
      try {
        setUser(null);
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (e2) {
        console.warn('AuthProvider: cleanup after signIn failure failed', e2);
      }
      return { success: false, message: 'Sign in failed' };
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('AuthProvider: signOut storage removal failed', e);
    } finally {
      setUser(null);
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
