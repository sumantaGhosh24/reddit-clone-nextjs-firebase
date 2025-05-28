"use client";

import {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import {doc, onSnapshot, DocumentData} from "firebase/firestore";

import {auth, db} from "./firebase";

interface AuthUser extends DocumentData {
  id: string;
}

interface FirebaseContextType {
  authUser: AuthUser | null;
  signUp: (email: string, password: string) => void;
  signIn: (email: string, password: string) => void;
  handleLogout: () => void;
}

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used with a FirebaseProvider");
  }
  return context;
};

export const FirebaseProvider = ({children}: FirebaseProviderProps) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseUser | null) => {
        if (user) {
          onSnapshot(doc(db, "users", user.uid), (doc) => {
            setAuthUser({...doc.data(), id: doc.id} as AuthUser);
          });
        } else {
          setAuthUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    authUser,
    signUp,
    signIn,
    handleLogout,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
