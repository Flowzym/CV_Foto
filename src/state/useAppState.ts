import { create } from 'zustand';

interface AppState {
  // State will be defined here
  placeholder: string;
}

export const useAppState = create<AppState>(() => ({
  placeholder: 'App state placeholder',
}));