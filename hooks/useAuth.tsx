import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  isAdmin: boolean;
  login: (user: Omit<User, 'role'>) => User;
  logout: () => void;
  updateCurrentUser: (data: Partial<Omit<User, 'id' | 'email' | 'role'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const login = (user: Omit<User, 'role'>): User => {
    const userWithRole: User = {
      ...user,
      plan: user.plan || 'free',
      role: user.email.toLowerCase() === 'admin@example.com' ? 'admin' : 'user',
    };
    setCurrentUser(userWithRole);
    return userWithRole;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = (data: Partial<Omit<User, 'id' | 'email' | 'role'>>) => {
      if (currentUser) {
          setCurrentUser(prev => ({...prev!, ...data}));
      }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!currentUser, currentUser, login, logout, isAdmin, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};