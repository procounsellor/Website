import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sendOtp, verifyOtp } from "@/api/auth"; 

type AuthState = {
  user: null | { id: string };
  isAuthenticated: boolean;
  isLoginToggle: boolean;
  toggleLogin: () => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoginToggle: false,

      toggleLogin: () =>
        set((state) => ({ isLoginToggle: !state.isLoginToggle })),

      sendOtp: async (phone: string) => {
        await sendOtp(phone);
        // any number just include 8 consecutive zeros zero 10 digit total
      },

      verifyOtp: async (phone: string, otp: string) => {
        await verifyOtp(phone, otp);
        // you will change this logic for now pass any otp 000000
        // here if user doesn't exist then we will not mark isLoginToggle false for now you can remove it and work on next pages 
        // and directly make it false from login card by importing the isLoginToggle from useAuthStore as well
        set({
          user: { id: phone },
          isAuthenticated: true,
          isLoginToggle: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoginToggle: false });
      },
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
