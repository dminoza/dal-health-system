import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock registered users
const REGISTERED_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Dr. Maria Santos',
    email: 'maria.santos@cdo.ph',
    password: 'health2024',
    role: 'Health Officer',
    avatar: 'MS',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@cdo.ph',
    password: 'admin123',
    role: 'Administrator',
    avatar: 'AU',
  },
  {
    id: '3',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@cdo.ph',
    password: 'password123',
    role: 'Data Analyst',
    avatar: 'JD',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('cdo_tb_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = REGISTERED_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }
    const { password: _, ...userData } = found;
    setUser(userData);
    sessionStorage.setItem('cdo_tb_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('cdo_tb_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
