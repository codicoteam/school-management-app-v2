import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  type AuthUser,
} from '@/lib/authService';
import { getToken } from '@/lib/apiClient';

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
  login: (email: string, password: string, role: UserRole) => Promise<AppUser>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<AppUser>;
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

const mapUser = (u: AuthUser): AppUser => ({
  id: u.id,
  uid: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!getToken()) {
          setUser(null);
          return;
        }
        const me = await getMe();
        setUser(me ? mapUser(me) : null);
      } catch (err) {
        console.error('Failed to load current user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const authUser = await apiLogin(email, password, role);
    const mapped = mapUser(authUser);
    setUser(mapped);
    return mapped;
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const authUser = await apiRegister({ email, password, name, role });
    const mapped = mapUser(authUser);
    setUser(mapped);
    return mapped;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
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
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
