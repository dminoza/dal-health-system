import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../utils/supabase';
import type { Session } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build our app User shape from a Supabase session */
function userFromSession(session: Session): User {
  const meta = session.user.user_metadata ?? {};

  const firstName = meta.first_name ?? '';
  const lastName  = meta.last_name  ?? '';
  const fullName  = meta.full_name  ?? `${firstName} ${lastName}`.trim();

  // Avatar initials: first letter of first + last name, or first two of email
  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : (session.user.email ?? 'U').slice(0, 2).toUpperCase();

  return {
    id:     session.user.id,
    name:   fullName || session.user.email!,
    email:  session.user.email!,
    role:   meta.role ?? 'Health Staff',
    avatar: initials,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true until first session check

  // -------------------------------------------------------------------------
  // On mount: load existing session + subscribe to auth state changes
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Get current session (e.g. after page refresh)
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      setUser(s ? userFromSession(s) : null);
      setLoading(false);
    });

    // Listen for sign-in / sign-out / token refresh
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s ? userFromSession(s) : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------------------------------------------------------------
  // Login
  // -------------------------------------------------------------------------
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
    // session + user are set automatically by onAuthStateChange above
  };

  // -------------------------------------------------------------------------
  // Logout
  // -------------------------------------------------------------------------
  const logout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange sets user + session to null automatically
  };

  // -------------------------------------------------------------------------
  // Provider
  // -------------------------------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
