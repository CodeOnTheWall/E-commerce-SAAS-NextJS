import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  // void means a function that takes no arguments and doesnt return any value
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
