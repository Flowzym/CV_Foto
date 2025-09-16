import { create } from 'zustand';

interface AppState {
  // Image processing state
  image: File | null;
  cropped: ImageData | null;
  alpha: ImageData | null;
  background: string | File | null;
  
  // Settings
  roundMask: boolean;
  exportFormat: 'png' | 'jpg' | 'webp';
  exportSize: { width: number; height: number };
  
  // Status
  status: 'idle' | 'processing' | 'complete' | 'error';
  error: string | null;
  
  // Actions
  setImage: (image: File | null) => void;
  setCropped: (cropped: ImageData | null) => void;
  setAlpha: (alpha: ImageData | null) => void;
  setBackground: (background: string | File | null) => void;
  setRoundMask: (roundMask: boolean) => void;
  setExportFormat: (format: 'png' | 'jpg' | 'webp') => void;
  setExportSize: (size: { width: number; height: number }) => void;
  setStatus: (status: 'idle' | 'processing' | 'complete' | 'error') => void;
  setError: (error: string | null) => void;
}

export const useAppState = create<AppState>((set) => ({
  // Initial state
  image: null,
  cropped: null,
  alpha: null,
  background: null,
  roundMask: false,
  exportFormat: 'png',
  exportSize: { width: 512, height: 512 },
  status: 'idle',
  error: null,
  
  // Actions
  setImage: (image) => set({ image }),
  setCropped: (cropped) => set({ cropped }),
  setAlpha: (alpha) => set({ alpha }),
  setBackground: (background) => set({ background }),
  setRoundMask: (roundMask) => set({ roundMask }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportSize: (exportSize) => set({ exportSize }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));