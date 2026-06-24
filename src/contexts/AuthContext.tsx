import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface AppUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribed = false;
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (unsubscribed) return;
        try {
          if (firebaseUser) {
            try {
              // Load user profile from Firestore
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

              if (userDoc.exists()) {
                const data = userDoc.data();
                setUser({
                  id: firebaseUser.uid,
                  uid: firebaseUser.uid,
                  name: data.name || '',
                  email: data.email || firebaseUser.email || '',
                  role: data.role as UserRole,
                });
              } else {
                // User exists in Firebase Auth but not in Firestore
                // This shouldn't normally happen; sign them out
                console.warn('User document not found in Firestore for uid:', firebaseUser.uid);
                await signOut(auth);
                setUser(null);
              }
            } catch (error) {
              console.error('Error loading user profile:', error);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        } finally {
          if (!unsubscribed) {
            setLoading(false);
          }
        }
      });

      return () => {
        unsubscribed = true;
        unsubscribe();
      };
    } catch (error) {
      console.error('Failed to set up auth listener:', error);
      setUser(null);
      setLoading(false);
      setError(error as Error);
    }
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If there's an error, show an error message
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-50 p-6">
        <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-lg text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
          <p className="mb-4">{error.message}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              // Trigger a retry by unmounting and remounting the effect? 
              // We'll just reload the page for simplicity.
              window.location.reload();
            }}
            className="btn btn-primary w-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
