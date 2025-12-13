import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (name: string, email: string, password: string) => User;
  login: (email: string, password: string) => User;
  googleLogin: () => User;
  logout: () => void;
  updateCurrentUser: (data: Partial<Omit<User, 'id' | 'email' | 'role'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'users_mock';
const CURRENT_USER_STORAGE_KEY = 'current_user';

const getMockUsers = (): User[] => {
    try {
      const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [
          { id: 'admin_user', name: 'Admin User', email: 'admin@example.com', plan: 'eternal', role: 'admin', createdAt: Date.now() },
          { id: 'demo_user', name: 'Demo User', email: 'user@example.com', plan: 'free', role: 'user', createdAt: Date.now() }
      ];
    } catch (e) { return []; }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getMockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const storedUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    if (currentUser) {
        window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
        window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
    // Simulate loading finishing
    setLoading(false);
  }, [currentUser]);

  const login = (email: string, password: string): User => {
    const user = users.find(u => u.email === email);
    if (user) { // In a real app, you'd check the password
      setCurrentUser(user);
      return user;
    }
    throw new Error('Invalid email or password');
  };
  
  const googleLogin = (): User => {
    let user = users.find(u => u.email === 'google_user@example.com');
    if (!user) {
        user = {
            id: `user_${Date.now()}`,
            name: 'Google User',
            email: 'google_user@example.com',
            plan: 'free',
            role: 'user',
            createdAt: Date.now()
        };
        setUsers(prev => [...prev, user]);
    }
    setCurrentUser(user);
    return user;
  };

  const signup = (name: string, email: string, password: string): User => {
    if (users.some(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      plan: 'free',
      role: 'user',
      createdAt: Date.now()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };
  
  const logout = () => {
    setCurrentUser(null);
  };
  
  const updateCurrentUser = (data: Partial<Omit<User, 'id' | 'email' | 'role'>>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const value = { isLoggedIn: !!currentUser, currentUser, loading, isAdmin, signup, login, googleLogin, logout, updateCurrentUser };

  return (
    <AuthContext.Provider value={value}>
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