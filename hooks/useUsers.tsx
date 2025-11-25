
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, MemorialPlan } from '../types';

// Initial mock data
const initialUsers: User[] = [
    { id: 'user123', name: 'Demo User', email: 'user@example.com', plan: 'free', role: 'user' },
    { id: 'user456', name: 'Premium User', email: 'premium@example.com', plan: 'premium', role: 'user' },
    { id: 'admin007', name: 'Admin', email: 'admin@example.com', plan: 'eternal', role: 'admin' },
];


interface UsersContextType {
  users: User[];
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const updateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
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
