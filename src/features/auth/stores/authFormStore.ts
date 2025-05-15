import { create } from "zustand";

type AuthFormState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
};

export const useAuthFormStore = create<AuthFormState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  mode: "login",
  setMode: (mode) => set({ mode }),
}));

export const authFormStore = {
  setIsOpen: (val: boolean) => {
    useAuthFormStore.getState().setIsOpen(val);
  },
  setMode: (val: "login" | "register") => {
    useAuthFormStore.getState().setMode(val);
  },
};


