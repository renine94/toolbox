import { create } from 'zustand';

interface ColorState {
    color: string; // Always stores the current color in HEX format
    setColor: (color: string) => void;
}

export const useColorStore = create<ColorState>((set) => ({
    color: '#3b82f6',
    setColor: (color) => set({ color }),
}));
