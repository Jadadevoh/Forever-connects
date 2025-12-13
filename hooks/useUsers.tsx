import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface UsersContextType {
  users: User[];
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

// In a non-Firebase version, this context is less dynamic and might not be strictly necessary,
// but we keep it for consistency and to allow the admin panel to function as designed.
const initialUsers: User[] = [
    { id: 'admin_user', name: 'Admin User', email: 'admin@example.com', plan: 'eternal', role: 'admin' },
    { id: 'demo_user', name: 'Demo User', email: 'user@example.com', plan: 'free', role: 'user' }
];


export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const updateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <UsersContext.Provider value={{ users, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};