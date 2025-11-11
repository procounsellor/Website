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
  role: "student" | "counselor" | "user" | null;
  isAuthenticated: boolean;
  isLoginToggle: boolean;
  userExist: boolean;
  isCounselorSignupOpen: boolean;
  isCounselorSignupFormOpen: boolean;
  loading: boolean;
  needsOnboarding: boolean;
  needsProfileCompletion: boolean;
  isProfileCompletionOpen: boolean;
  returnToPath: string | null;
  isCounselorSignupFlow: boolean;
  toggleLogin: (onSuccess?: () => void) => void;
  toggleCounselorSignup: () => void;
  openCounselorSignupForm: () => void;
  closeCounselorSignupForm: () => void;
  toggleProfileCompletion: () => void;
  setIsProfileCompletionOpen: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsCounselorSignupFlow: (value: boolean) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  refreshUser: (force?: boolean) => Promise<User | null>;
  onLoginSuccess: (() => void) | null;
  logout: () => void;
  pendingAction?: (() => void) | null;
  setPendingAction: (fn: (() => void) | null) => void;
  bookingTriggered: boolean;
  setBookingTriggered: (value: boolean) => void;
  setReturnToPath: (path: string | null) => void;
  setNeedsOnboarding: (value: boolean) => void;
  setNeedsProfileCompletion: (value: boolean) => void;
  checkProfileCompletion: () => boolean;
  clearOnLoginSuccess: () => void;
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
      isCounselorSignupFormOpen: false,
      loading: true,
      onLoginSuccess: null,
      pendingAction: null,
      needsOnboarding: false,
      needsProfileCompletion: false,
      isProfileCompletionOpen: false,
      returnToPath: null,
      isCounselorSignupFlow: false,
      setPendingAction: (fn) => set({ pendingAction: fn }),
      bookingTriggered: false,
      setBookingTriggered: (value) => set({ bookingTriggered: value }),
      setReturnToPath: (path) => set({ returnToPath: path }),
      setNeedsOnboarding: (value) => set({ needsOnboarding: value }),
      setNeedsProfileCompletion: (value) => set({ needsProfileCompletion: value }),
      setIsCounselorSignupFlow: (value) => set({ isCounselorSignupFlow: value }),
      
      checkProfileCompletion: () => {
        const state = get();
        if (!state.user) return true;
        return !!(state.user.firstName && state.user.email);
      },

      clearOnLoginSuccess: () => set({ onLoginSuccess: null }),

      toggleLogin: (onSuccess?: () => void) =>
        set((state) => ({
          isLoginToggle: !state.isLoginToggle,
          onLoginSuccess: !state.isLoginToggle ? (onSuccess || null) : null,
        })),

      toggleCounselorSignup: () =>
        set((state) => ({
          isCounselorSignupOpen: !state.isCounselorSignupOpen,
        })),

      openCounselorSignupForm: () =>
        set({ 
          isCounselorSignupOpen: false,
          isCounselorSignupFormOpen: true 
        }),

      closeCounselorSignupForm: () =>
        set({ isCounselorSignupFormOpen: false }),

      toggleProfileCompletion: () =>
        set((state) => ({
          isProfileCompletionOpen: !state.isProfileCompletionOpen,
        })),

      setIsProfileCompletionOpen: (value) => set({ isProfileCompletionOpen: value }),

      setUser: (user) =>
        set({
          user,
          userId: user ? user.userName ?? null : null,
          role: user ? (user.role.toLowerCase() as AuthState["role"]) : null,
        }),

      refreshUser: async (force = false) => {
  const state = get();

  if (state.loading && !force) {
    return state.user;
  }

  set({ loading: true });

  const uid =
    state.userId ??
    (typeof window !== "undefined" ? localStorage.getItem("phone") : null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const role =
    state.role ??
    (typeof window !== "undefined" ? localStorage.getItem("role") : null);

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
        set({ user: mapped, role: "counselor" });
        return mapped;
      }
      throw new Error("Counselor profile not found");
    }

    const user = await getUserProfile(uid, token);
    user.role = user.role.toLowerCase();
    set({ user, role: user.role as AuthState["role"] });
    return user;
  } catch (err) {
    get().logout();
    return null;
  } finally {
    set({ loading: false });
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
          console.error("Failed to save JWT/phone:", err);
        }

        try {
          const isProfileIncomplete = await checkUrl(phone, data?.jwt ?? data?.jwtToken);
          console.log('🔍 isUserDetailsNull API response:', isProfileIncomplete);
          const { isCounselorSignupFlow } = get();
          if (isCounselorSignupFlow) {
            console.log('User is in counselor signup flow, skipping onboarding');
            set({ userExist: false, needsOnboarding: false });
          } else if (isProfileIncomplete === true) {
            console.log('Setting needsOnboarding to TRUE');
            set({ userExist: true, needsOnboarding: true });
          } else {
            console.log('Setting needsOnboarding to FALSE');
            set({ userExist: false, needsOnboarding: false });
          }
        } catch (err) {
          console.error('checkUrl failed:', err);
          set({ userExist: false, needsOnboarding: false });
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
                needsProfileCompletion: false,
              });

              const { onLoginSuccess } = get();
              if (onLoginSuccess) {
                onLoginSuccess();
                set({ onLoginSuccess: null });
              }
              
              set({ isCounselorSignupFlow: false });
            }
          } else {
            const user = await getUserProfile(phone, data.jwtToken);

            if (user) {
              user.role = user.role.toLowerCase();
              
              const needsCompletion = !user.firstName || !user.email;
              console.log('🔍 Profile check - firstName:', user.firstName, 'email:', user.email, 'needsCompletion:', needsCompletion);
              
              set({
                user,
                role: user.role as AuthState["role"],
                isAuthenticated: true,
                loading: false,
                needsProfileCompletion: needsCompletion,
              });

              // Only execute onLoginSuccess if user doesn't need onboarding
              // If they need onboarding, the callback will be executed after onboarding completes
              const { onLoginSuccess, needsOnboarding } = get();
              if (onLoginSuccess && !needsOnboarding && !needsCompletion) {
                onLoginSuccess();
                set({ onLoginSuccess: null });
              }
              set({ isCounselorSignupFlow: false });
            }
          }
        } catch (err) {
          console.error("Failed during verifyOtp data fetch:", err);
        }

        const { pendingAction } = get();
        const { setBookingTriggered } = get();

        if (pendingAction) {
          setTimeout(() => {
            setBookingTriggered(true);
            set({ pendingAction: null });
          }, 400);
        }

        set({ isLoginToggle: false, loading: false });
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
          needsOnboarding: false,
          needsProfileCompletion: false,
          isProfileCompletionOpen: false,
          returnToPath: null,
          pendingAction: null,
          isCounselorSignupFlow: false,
        });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['user', 'userId', 'role', 'isAuthenticated', 'userExist', 'needsOnboarding', 'needsProfileCompletion'].includes(key)
          )
        ),
      onRehydrateStorage: () => (state, error) => {
  if (!error && state) {
    setTimeout(() => {
      state.loading = false;
    }, 100);
  }
},
    }
  )
);
