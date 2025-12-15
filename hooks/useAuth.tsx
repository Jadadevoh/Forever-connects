import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

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

  // Sync Firebase Auth state with Firestore User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            // Create user profile in Firestore if it doesn't exist (e.g. first Google Login)
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              plan: 'free',
              role: 'user',
              createdAt: Date.now()
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error.message);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      setCurrentUser(userData);
      return userData;
    } else {
      throw new Error("User profile not found");
    }
  };
  
  const googleLogin = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // The onAuthStateChanged listener handles fetching/creating the Firestore doc
    // We just wait a brief moment for state to update or manually fetch to return immediately
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      const newUser: User = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email || '',
        plan: 'free',
        role: 'user',
        createdAt: Date.now()
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });

    const newUser: User = {
      id: userCredential.user.uid,
      name,
      email,
      plan: 'free',
      role: 'user',
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    setCurrentUser(newUser);
    return newUser;
  };
  
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
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