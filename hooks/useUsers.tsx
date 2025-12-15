import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

interface UsersContextType {
  users: User[];
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Only admins are allowed to read the full users collection
    if (!isAdmin) {
        setUsers([]);
        return;
    }

    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => doc.data() as User);
      setUsers(fetchedUsers);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return unsubscribe;
  }, [isAdmin]);

  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updatedData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
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