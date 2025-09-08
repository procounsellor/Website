import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { checkUrl, sendOtp, verifyOtp } from "@/api/auth"; 

type AuthState = {
  userId:string | null;
  isAuthenticated: boolean;
  isLoginToggle: boolean;
  toggleLogin: () => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  userExist:boolean
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,
      isLoginToggle: false,
      userExist:false,

      toggleLogin: () =>
        set((state) => ({ isLoginToggle: !state.isLoginToggle })),

      sendOtp: async (phone: string) => {
        await sendOtp(phone);
      },

      verifyOtp: async (phone: string, otp: string) => {
        const data = await verifyOtp(phone, otp);
        set({
          userId:phone,
          isLoginToggle:false,
          isAuthenticated: true,
        });
        sessionStorage.setItem('phone', phone)
        sessionStorage.setItem('jwt', data.jwtToken)
        const res = await checkUrl(phone, data.jwt)
        set({userExist:res , isLoginToggle:res})
      },

      logout: () => {
        set({ userId: null, isAuthenticated: false, isLoginToggle: false });
      },
    }),
    {
      name: "user", 
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);