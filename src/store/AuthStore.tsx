import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { checkUrl, sendOtp, verifyOtp } from "@/api/auth";
import { getUserProfile } from "@/api/user";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoginToggle: boolean;
  userExist: boolean;
  toggleLogin: () => void;
  setUser: (user: User | null) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  refreshUser: (force?: boolean) => Promise<User | null>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userId: null,
      isAuthenticated: false,
      isLoginToggle: false,
      userExist: false,

      toggleLogin: () => set((state) => ({ isLoginToggle: !state.isLoginToggle })),

      setUser: (user) => set({ user, userId: user ? (user.userName ?? null) : null }),

      refreshUser: async (force = false) => {
        const getter = get as () => AuthState;
        const state = getter();
  const uid = state.userId ?? (typeof window !== 'undefined' ? localStorage.getItem('phone') : null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  if (!uid || !token) return null;

  if (!force && state.user) return state.user;

        try {
          const user = await getUserProfile(uid, token);
          set({ user });
          return user;
        } catch (err) {
          console.error('refreshUser failed', err);
          return null;
        }
      },

      sendOtp: async (phone: string) => {
        await sendOtp(phone);
      },

      verifyOtp: async (phone: string, otp: string) => {
        const data = await verifyOtp(phone, otp);
        set({ userId: phone, isAuthenticated: true });

        try {
          if (data?.jwtToken) localStorage.setItem("jwt", data.jwtToken);
          if (phone) localStorage.setItem("phone", phone);
        } catch {
          // ignore localStorage errors in SSR or private modes
        }

        // check whether user details are present
        try {
          const res = await checkUrl(phone, data?.jwt ?? data?.jwtToken);
          set({ userExist: Boolean(res), isLoginToggle: Boolean(res) });
        } catch {
          set({ userExist: false });
        }

        // fetch and cache the full user profile so other pages can read from store
        try {
          const getter2 = get as () => AuthState;
          await getter2().refreshUser(true);
        } catch (err) {
          console.error('Failed to refresh user after verifyOtp', err);
        }
      },

      logout: () => {
        try {
          localStorage.removeItem("jwt");
          localStorage.removeItem("phone");
        } catch {
          /* ignore */
        }
        set({ user: null, userId: null, isAuthenticated: false, isLoginToggle: false, userExist: false });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);