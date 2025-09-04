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
      },

      verifyOtp: async (phone: string, otp: string) => {
        await verifyOtp(phone, otp);
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
