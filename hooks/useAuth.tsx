import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
// FIX: Imported 'updateDoc' to fix "Cannot find name 'updateDoc'" error.
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';


interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (name: string, email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  googleLogin: () => Promise<User>;
  logout: () => Promise<void>;
  updateCurrentUser: (data: Partial<Omit<User, 'id' | 'email' | 'role'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUser({ id: userDoc.id, ...userDoc.data() } as User);
        } else {
          // This case might happen with social logins for the first time
          // Or if the user doc was deleted. We can create it here.
           const newUser = await createUserProfile(firebaseUser, firebaseUser.displayName || "New User");
           setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const createUserProfile = async (firebaseUser: FirebaseUser, name: string): Promise<User> => {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const newUser: Omit<User, 'id'> = {
          name: name,
          email: firebaseUser.email!,
          plan: 'free',
          role: 'user',
          createdAt: Date.now()
      };
      await setDoc(userDocRef, newUser);
      return { id: firebaseUser.uid, ...newUser };
  };

  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error("User profile not found.");
    return { id: userDoc.id, ...userDoc.data() } as User;
  };
  
  const googleLogin = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    } else {
        return await createUserProfile(user, user.displayName || 'Google User');
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = await createUserProfile(userCredential.user, name);
    return newUser;
  };
  
  const logout = async () => {
    await signOut(auth);
  };
  
  const updateCurrentUser = async (data: Partial<Omit<User, 'id' | 'email' | 'role'>>) => {
    if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.id);
        await updateDoc(userDocRef, data);
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const value = { isLoggedIn: !!currentUser, currentUser, loading, isAdmin, signup, login, googleLogin, logout, updateCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {/* FIX: Corrected typo in closing tag. */}
      {!loading && children}
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