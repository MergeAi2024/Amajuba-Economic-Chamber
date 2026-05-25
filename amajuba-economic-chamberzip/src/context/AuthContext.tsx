import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthUser = {
  id: string;
  email: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ requiresConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initializeSession = async () => {
      const { data } = await supabase.auth.getSession();
      const nextSession = data.session ?? null;
      setSession(nextSession);
      setUser(nextSession?.user
        ? {
            id: nextSession.user.id,
            email: nextSession.user.email ?? '',
          }
        : null);
      setLoading(false);
    };

    initializeSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user
        ? {
            id: nextSession.user.id,
            email: nextSession.user.email ?? '',
          }
        : null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    setSession(data.session);
    setUser(data.session?.user
      ? {
          id: data.session.user.id,
          email: data.session.user.email ?? email,
        }
      : null);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const { error, data } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    const nextSession = data.session ?? null;
    setSession(nextSession);
    setUser(nextSession?.user
      ? {
          id: nextSession.user.id,
          email: nextSession.user.email ?? email,
        }
      : null);

    return {
      requiresConfirmation: !nextSession,
    };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [loading, session, signIn, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
