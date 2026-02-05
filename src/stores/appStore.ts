import { create } from 'zustand';
import type { SaaSApplication, Recommendation } from '@/types';
import { mockSaaSApps, mockRecommendations } from '@/data/mockData';

interface AppState {
  saasApps: SaaSApplication[];
  recommendations: Recommendation[];
  addSaaSApp: (app: SaaSApplication) => void;
  updateSaaSApp: (id: string, updates: Partial<SaaSApplication>) => void;
  deleteSaaSApp: (id: string) => void;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  saasApps: mockSaaSApps,
  recommendations: mockRecommendations,
  
  addSaaSApp: (app) => {
    set(state => ({
      saasApps: [...state.saasApps, app],
    }));
  },
  
  updateSaaSApp: (id, updates) => {
    set(state => ({
      saasApps: state.saasApps.map(app =>
        app.id === id ? { ...app, ...updates, updated_at: new Date().toISOString() } : app
      ),
    }));
  },
  
  deleteSaaSApp: (id) => {
    set(state => ({
      saasApps: state.saasApps.filter(app => app.id !== id),
    }));
  },
  
  updateRecommendation: (id, updates) => {
    set(state => ({
      recommendations: state.recommendations.map(rec =>
        rec.id === id ? { ...rec, ...updates, updated_at: new Date().toISOString() } : rec
      ),
    }));
  },
}));
