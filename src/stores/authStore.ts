import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { mockUsers, currentUser as defaultUser } from '@/data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultUser,
  isAuthenticated: true,
  isLoading: false,
  
  login: async (email: string, role?: UserRole) => {
    set({ isLoading: true });
    
    // Simulate SSO login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email) || {
      ...defaultUser,
      email,
      role: role || 'admin',
    };
    
    set({ user, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  switchRole: (role: UserRole) => {
    set(state => ({
      user: state.user ? { ...state.user, role } : null,
    }));
  },
}));
