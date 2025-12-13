import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Memorial, Tribute, Donation, Photo } from '../types';
import { db } from '../firebase';
import { 
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, onSnapshot, 
    serverTimestamp, setDoc, getDoc, orderBy
} from 'firebase/firestore';

interface MemorialsContextType {
  memorials: Memorial[];
  loading: boolean;
  addMemorial: (memorialData: Omit<Memorial, 'id' | 'slug'>) => Promise<Memorial>;
  getMemorialById: (id: string) => Memorial | undefined;
  getMemorialBySlug: (slug: string) => Memorial | undefined;
  addTribute: (memorialId: string, tributeData: { author: string; message: string; photo?: Photo }) => Promise<void>;
  toggleLike: (memorialId: string, tributeId: string, userId: string) => Promise<void>;
  deleteMemorial: (memorialId: string) => Promise<void>;
  updateMemorial: (id: string, updatedData: Partial<Memorial>) => Promise<void>;
  updateMemorialSlug: (id: string, newSlug: string) => Promise<{ success: boolean, message: string }>;
  addDonation: (memorialId: string, donation: Omit<Donation, 'id' | 'date'>) => Promise<void>;
  updateDonationsStatusForOwner: (ownerId: string, newStatus: 'paid') => Promise<void>;
}

const MemorialsContext = createContext<MemorialsContextType | undefined>(undefined);

const generateSlug = async (firstName: string, lastName: string, deathDate: string): Promise<string> => {
    const deathYear = new Date(deathDate).getFullYear();
    let baseSlug = `${firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (deathYear && !isNaN(deathYear)) {
        baseSlug += `-${deathYear}`;
    }

    let finalSlug = baseSlug;
    let counter = 2;
    // Check for uniqueness in Firestore
    while (true) {
        const q = query(collection(db, 'memorials'), where("slug", "==", finalSlug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            break;
        }
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return finalSlug;
};

export const MemorialsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "memorials"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const memorialsData: Memorial[] = [];
      querySnapshot.forEach((doc) => {
        memorialsData.push({ id: doc.id, ...doc.data() } as Memorial);
      });
      setMemorials(memorialsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const addMemorial = async (memorialData: Omit<Memorial, 'id' | 'slug'>): Promise<Memorial> => {
    const fullName = [memorialData.firstName, memorialData.middleName, memorialData.lastName].filter(Boolean).join(' ');
    const newSlug = await generateSlug(memorialData.firstName, memorialData.lastName, memorialData.deathDate);
    
    const newMemorialData: Omit<Memorial, 'id'> = {
      ...memorialData,
      slug: newSlug,
      plan: memorialData.plan || 'free',
      donations: [],
      donationInfo: memorialData.donationInfo || {
        isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: true,
        suggestedAmounts: [25, 50, 100, 250], purpose: 'General Support for the Family',
      },
      emailSettings: memorialData.emailSettings || {
        senderName: `${fullName} Tribute Team`, replyToEmail: '',
        headerImageUrl: memorialData.profileImage?.url || '', footerMessage: `In loving memory of ${fullName}.`
      },
      status: memorialData.status || 'active',
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, 'memorials'), newMemorialData);
    return { id: docRef.id, ...newMemorialData };
  };

  const getMemorialById = useCallback((id: string) => {
    return memorials.find(m => m.id === id);
  }, [memorials]);
  
  const getMemorialBySlug = useCallback((slug: string) => {
    return memorials.find(m => m.slug === slug);
  }, [memorials]);

  const addTribute = async (memorialId: string, tributeData: { author: string; message: string; photo?: Photo }) => {
    const tributesCollectionRef = collection(db, 'memorials', memorialId, 'tributes');
    await addDoc(tributesCollectionRef, {
        ...tributeData,
        createdAt: serverTimestamp(),
        // FIX: Initialize likes to 0 for new tributes.
        likes: 0,
    });
  };

  const toggleLike = async (memorialId: string, tributeId: string, userId: string) => {
    const likeDocRef = doc(db, 'memorials', memorialId, 'tributes', tributeId, 'likes', userId);
    const likeDoc = await getDoc(likeDocRef);

    if (likeDoc.exists()) {
        await deleteDoc(likeDocRef);
    } else {
        await setDoc(likeDocRef, { likedAt: serverTimestamp() });
    }
  };

  const deleteMemorial = async (memorialId: string) => {
    await deleteDoc(doc(db, 'memorials', memorialId));
  };

  const updateMemorial = async (id: string, updatedData: Partial<Memorial>) => {
    const memorialDocRef = doc(db, 'memorials', id);
    await updateDoc(memorialDocRef, updatedData);
  };

  const updateMemorialSlug = async (id: string, newSlug: string): Promise<{ success: boolean; message: string }> => {
    const formattedSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    if (!formattedSlug) {
        return { success: false, message: "Web address cannot be empty and must contain letters, numbers, or hyphens." };
    }
    const q = query(collection(db, 'memorials'), where("slug", "==", formattedSlug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty && querySnapshot.docs[0].id !== id) {
        return { success: false, message: "This web address is already in use. Please choose another." };
    }
    await updateMemorial(id, { slug: formattedSlug });
    return { success: true, message: "Web address updated successfully!" };
  };

  const addDonation = async (memorialId: string, donation: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Omit<Donation, 'id'> = {
        ...donation,
        date: Date.now(),
    };
    const memorialDocRef = doc(db, 'memorials', memorialId);
    const memorialDoc = await getDoc(memorialDocRef);
    if (memorialDoc.exists()) {
        const currentDonations = memorialDoc.data().donations || [];
        await updateDoc(memorialDocRef, {
            donations: [...currentDonations, newDonation]
        });
    }
  };

  const updateDonationsStatusForOwner = async (ownerId: string, newStatus: 'paid') => {
      const q = query(collection(db, 'memorials'), where('userId', '==', ownerId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (memorialDoc) => {
          const memorialData = memorialDoc.data() as Memorial;
          const updatedDonations = memorialData.donations.map(d => 
              d.payoutStatus === 'pending' ? { ...d, payoutStatus: newStatus } : d
          );
          await updateDoc(memorialDoc.ref, { donations: updatedDonations });
      });
  };

  const value = { 
    memorials, loading, addMemorial, getMemorialById, getMemorialBySlug, addTribute, 
    toggleLike, deleteMemorial, updateMemorial, updateMemorialSlug, addDonation,
    updateDonationsStatusForOwner
  };

  return (
    <MemorialsContext.Provider value={value}>
      {children}
    </MemorialsContext.Provider>
  );
};

export const useMemorials = (): MemorialsContextType => {
  const context = useContext(MemorialsContext);
  if (context === undefined) {
    throw new Error('useMemorials must be used within a MemorialsProvider');
  }
  return context;
};