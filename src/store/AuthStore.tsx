import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { checkUrl, sendOtp, verifyOtp as apiVerifyOtp } from "@/api/auth";
import { getUserProfile } from "@/api/user";
import { getCounselorProfileById } from "@/api/counselor-Dashboard";
import type { User } from "@/types/user";
import type { CounselorProfileData } from "@/types/counselorProfile";
import type { Transaction as UserTransaction } from "@/types/user";

const mapCounselorToUser = (counselorData: CounselorProfileData): User => {
  return {
    userName: counselorData.userName,
    firstName: counselorData.firstName,
    lastName: counselorData.lastName,
    phoneNumber: counselorData.phoneNumber,
    email: counselorData.email,
    role: counselorData.role.trim().toLowerCase(),
    verified: counselorData.verified,
    photo: counselorData.photoUrl,
    photoSmall: counselorData.photoUrlSmall,
    languagesKnow: counselorData.languagesKnow,
    walletAmount: counselorData.walletAmount || 0,
    transactions: [] as UserTransaction[],
    offlineTransactions: [],
    activityLog: counselorData.activityLog || [],
    userInterestedStateOfCounsellors: null,
    interestedCourse: null,
  };
};

type AuthState = {
  user: User | null;
  userId: string | null;
  role: "student" | "counselor" | null;
  isAuthenticated: boolean;
  isLoginToggle: boolean;
  userExist: boolean;
  isCounselorSignupOpen: boolean;
  loading: boolean;
  toggleLogin: (onSuccess?: () => void) => void;
  toggleCounselorSignup: () => void;
  setUser: (user: User | null) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  refreshUser: (force?: boolean) => Promise<User | null>;
  onLoginSuccess: (() => void) | null;
  logout: () => void;
  pendingAction?: (() => void) | null;
  setPendingAction: (fn: (() => void) | null) => void;
  bookingTriggered: boolean;
setBookingTriggered: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userId: null,
      role: null,
      isAuthenticated: false,
      isLoginToggle: false,
      userExist: false,
      isCounselorSignupOpen: false,
      loading: true,
      onLoginSuccess: null,
      pendingAction: null,
      setPendingAction: (fn) => set({ pendingAction: fn }),
      bookingTriggered: false,
      setBookingTriggered: (value) => set({ bookingTriggered: value }),

      toggleLogin: (onSuccess?: () => void) =>
        set((state) => ({
          isLoginToggle: !state.isLoginToggle,
          onLoginSuccess: !state.isLoginToggle ? (onSuccess || null) : null,
        })),

      toggleCounselorSignup: () =>
        set((state) => ({
          isCounselorSignupOpen: !state.isCounselorSignupOpen,
        })),

      setUser: (user) =>
        set({
          user,
          userId: user ? user.userName ?? null : null,
          role: user ? (user.role.toLowerCase() as AuthState["role"]) : null,
        }),

      refreshUser: async (force = false) => {
        set({ loading: true });

        const state = get();
        const uid =
          state.userId ??
          (typeof window !== "undefined" ? localStorage.getItem("phone") : null);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("jwt")
            : null;
        const role =
          state.role ??
          (typeof window !== "undefined"
            ? localStorage.getItem("role")
            : null);

        if (!uid || !token) {
          set({ loading: false });
          return null;
        }

        if (!force && state.user) {
          set({ loading: false });
          return state.user;
        }

        try {
          if (role === "counselor") {
            const counselorData = await getCounselorProfileById(uid, token);
            if (counselorData) {
              const mapped = mapCounselorToUser(counselorData);
              set({ user: mapped, role: "counselor", loading: false });
              return mapped;
            }
            throw new Error("Counselor profile not found");
          }

          const user = await getUserProfile(uid, token);
          user.role = user.role.toLowerCase();
          set({ user, role: user.role as AuthState["role"], loading: false });
          return user;
        } catch (err) {
          get().logout();
          return null;
        } finally {
          // set({ loading: false });
        }
      },

      sendOtp: async (phone: string) => {
        await sendOtp(phone);
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ loading: true });

        const data = await apiVerifyOtp(phone, otp);

        const isUser = data?.isUser === true || data?.isUser === "true";
        const role = isUser ? "student" : "counselor";

        set({ userId: phone, isAuthenticated: true, role });
        localStorage.setItem("role", role);

        try {
          if (data?.jwtToken) {
            localStorage.setItem("jwt", data.jwtToken);
          }
          if (phone) {
            localStorage.setItem("phone", phone);
          }
        } catch (err) {
          console.error("⚠️ Failed to save JWT/phone:", err);
        }

        try {
          const res = await checkUrl(phone, data?.jwt ?? data?.jwtToken);
          set({ userExist: Boolean(res) });
        } catch {
          set({ userExist: false });
        }

        try {
          if (!isUser) {
            const counselorData = await getCounselorProfileById(phone, data.jwtToken);

            if (counselorData) {
              const mapped = mapCounselorToUser(counselorData);
              set({
                user: mapped,
                role: "counselor",
                isAuthenticated: true,
                loading: false,
              });

              const { onLoginSuccess } = get();
              if (onLoginSuccess) {
                onLoginSuccess();
                set({ onLoginSuccess: null });
              }
            }
            } else {
              const user = await getUserProfile(phone, data.jwtToken);

            if (user) {
              user.role = user.role.toLowerCase();
              set({
                user,
                role: user.role as AuthState["role"],
                isAuthenticated: true,
                loading: false,
              });

            const { onLoginSuccess } = get();
            if (onLoginSuccess) {
              onLoginSuccess();
              set({ onLoginSuccess: null });
            }
          }
        }

        const { pendingAction } = get();
        const { setBookingTriggered } = get();

        if (pendingAction) {
          set({ isLoginToggle: false });

          setTimeout(() => {
            setBookingTriggered(true);
            set({ pendingAction: null });
          }, 400);
        } else {
          set({ isLoginToggle: false });
        }

      } catch (err) {
        console.error("❌ Failed during verifyOtp data fetch:", err);
      } finally {
        set({ loading: false });
      }
    },

      logout: () => {
        try {
          localStorage.removeItem("jwt");
          localStorage.removeItem("phone");
          localStorage.removeItem("role");
        } catch {}
        set({
          user: null,
          userId: null,
          isAuthenticated: false,
          isLoginToggle: false,
          userExist: false,
          role: null,
          onLoginSuccess: null,
          loading: false,
        });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['user', 'userId', 'role', 'isAuthenticated', 'userExist'].includes(key)
          )
        ),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // console.log("✅ Zustand rehydrated from localStorage");
        }
      },
    }
  )
);
