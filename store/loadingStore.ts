import { create } from 'zustand';

interface LoadingStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}));
