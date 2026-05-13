import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl } from "../lib/query-client";

async function readResponseBody(res: Response): Promise<{
  text: string;
  json: any | null;
}> {
  const text = await res.text();
  try {
    return { text, json: text ? JSON.parse(text) : null };
  } catch {
    return { text, json: null };
  }
}

interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  selfieVerified: boolean;
  selfieSubmitted: boolean;
  invitedBy?: string;
  displayName?: string;
  vehicle?: string;
  nomadStyle?: string;
  photoURL?: string;
  onboardingComplete?: boolean;
}

type AuthMethod = "phone" | "email";

type PendingAuthPayload = {
  type: AuthMethod;
  value: string;
} | null;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingAuth: PendingAuthPayload;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  sendOTP: (
    type: AuthMethod,
    value: string,
  ) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (code: string) => Promise<{ success: boolean; message?: string }>;
  resendVerification: () => Promise<{ success: boolean; message?: string }>;
  checkEmailVerified: () => Promise<boolean>;
  submitSelfie: (
    selfieData?: string,
  ) => Promise<{ success: boolean; message?: string }>;
  refreshUserStatus: () => Promise<void>;
  updateProfile: (
    profile: Partial<User>,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "@wildergo_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuthPayload>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log("[AUTH] loadStoredAuth: reading AsyncStorage key", AUTH_STORAGE_KEY);
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("[AUTH] loadStoredAuth: restored session", {
          uid: parsed?.uid,
          email: parsed?.email,
          onboardingComplete: parsed?.onboardingComplete,
        });
        setUser(parsed);
      } else {
        console.log("[AUTH] loadStoredAuth: no stored session");
      }
    } catch (error) {
      console.error("[AUTH] loadStoredAuth: error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const signUp = useCallback(async (email: string, password: string) => {
    console.log(`[CLIENT SIGNUP] === Starting signup for: ${email} ===`);
    try {
      const baseUrl = getApiUrl();
      const url = new URL("/api/auth/signup", baseUrl).href;
      console.log(`[CLIENT SIGNUP] Sending POST to: ${url}`);
      console.log("Full URL being called:", url);
      console.log(
        `[CLIENT SIGNUP] Payload: { email: "${email}", password: "***" }`,
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(
        `[CLIENT SIGNUP] Response status: ${response.status} ${response.statusText}`,
      );

      const { text, json } = await readResponseBody(response);
      const data = json ?? { success: false, message: text || response.statusText };
      console.log(`[CLIENT SIGNUP] Response body:`, text);

      if (data.success && data.uid) {
        console.log(`[CLIENT SIGNUP] SUCCESS - uid: ${data.uid}`);
        const newUser: User = {
          uid: data.uid,
          email: email.toLowerCase().trim(),
          emailVerified: true,
          selfieVerified: true,
          selfieSubmitted: true,
          onboardingComplete: true,
        };
        await saveUser(newUser);
        console.log(
          `[CLIENT SIGNUP] User saved to AsyncStorage with onboardingComplete=true, auto-navigating to home`,
        );
      } else {
        console.log(`[CLIENT SIGNUP] FAILED - message: ${data.message}`);
      }

      return data;
    } catch (error: any) {
      console.error(`[CLIENT SIGNUP] NETWORK ERROR:`, error?.message);
      console.error(
        `[CLIENT SIGNUP] Error details:`,
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      );
      return { success: false, message: "Network error. Please try again." };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const baseUrl = getApiUrl();
      const fullUrl = new URL("/api/auth/login", baseUrl).href;

      console.log("[AUTH signIn] step:init", {
        normalizedEmail,
        baseUrl,
        fullUrl,
        __DEV__,
      });

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
        signal: controller.signal,
      });

      console.log("[AUTH signIn] step:http-response", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      const { text, json } = await readResponseBody(response);
      console.log("[AUTH signIn] step:body", {
        snippet: (text || "").trim().slice(0, 240),
        parsedJson: json != null,
      });

      if (!response.ok) {
        console.warn("[AUTH signIn] step:fail-http", {
          status: response.status,
          message: json?.message,
        });
        return {
          success: false,
          message:
            json?.message ||
            `Server error (${response.status}). Please try again.`,
        };
      }

      const data =
        json ??
        ({
          success: false,
          message:
            (text || "").trim().startsWith("<")
              ? "Server returned an HTML error page."
              : text || response.statusText,
        } as any);

      console.log("[AUTH signIn] step:parsed-payload", {
        success: data?.success,
        hasUid: Boolean(data?.uid),
        emailVerified: data?.emailVerified,
        selfieVerified: data?.selfieVerified,
        onboardingComplete: data?.onboardingComplete,
        message: data?.message,
      });

      if (data.success && data.uid) {
        console.log("[AUTH signIn] step:save-user", { uid: data.uid });
        const newUser: User = {
          uid: data.uid,
          email: normalizedEmail,
          emailVerified: Boolean(data.emailVerified),
          selfieVerified: Boolean(data.selfieVerified),
          selfieSubmitted: Boolean(
            data.selfieSubmitted ?? data.selfieVerified,
          ),
          invitedBy: data.invitedBy,
          // Keep signed-in users out of a dead-end onboarding loop when Firestore
          // has not yet set onboardingComplete.
          onboardingComplete: true,
        };
        await saveUser(newUser);
        console.log("[AUTH signIn] step:done-ok", {
          onboardingComplete: newUser.onboardingComplete,
        });
      } else {
        console.warn("[AUTH signIn] step:done-no-session", {
          success: data?.success,
          message: data?.message,
        });
      }

      return data;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.warn("[AUTH signIn] step:abort-timeout");
        return {
          success: false,
          message: "Server is waking up. Please wait a moment and try again.",
        };
      }
      console.error("[AUTH signIn] step:exception", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      });
      return { success: false, message: "Network error. Please try again." };
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  const resendVerification = useCallback(async () => {
    if (!user) return { success: false, message: "Not authenticated" };

    try {
      const baseUrl = getApiUrl();
      const response = await fetch(
        new URL("/api/auth/send-verification", baseUrl).href,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        },
      );

      return await response.json();
    } catch (error: any) {
      return { success: false, message: "Network error. Please try again." };
    }
  }, [user]);

  const checkEmailVerified = useCallback(async () => {
    if (!user) return false;

    try {
      const baseUrl = getApiUrl();
      const response = await fetch(
        new URL(`/api/auth/check-verification/${user.uid}`, baseUrl).href,
      );
      const data = await response.json();

      if (data.success && data.emailVerified) {
        const updatedUser = { ...user, emailVerified: true };
        await saveUser(updatedUser);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }, [user]);

  const submitSelfie = useCallback(
    async (selfieData?: string) => {
      if (!user) return { success: false, message: "Not authenticated" };

      try {
        const baseUrl = getApiUrl();
        const response = await fetch(
          new URL("/api/auth/submit-selfie", baseUrl).href,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              selfieData: selfieData || "submitted",
            }),
          },
        );

        const data = await response.json();

        if (data.success) {
          const updatedUser = { ...user, selfieSubmitted: true };
          await saveUser(updatedUser);
        }

        return data;
      } catch (error: any) {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [user],
  );

  const refreshUserStatus = useCallback(async () => {
    if (!user) return;

    try {
      const baseUrl = getApiUrl();
      const response = await fetch(
        new URL(`/api/auth/user-status/${user.uid}`, baseUrl).href,
      );
      const data = await response.json();

      if (data.success) {
        const updatedUser = {
          ...user,
          emailVerified: data.emailVerified || false,
          selfieVerified: data.selfieVerified || false,
          selfieSubmitted: data.selfieSubmitted || false,
        };
        await saveUser(updatedUser);
      }
    } catch (error) {
      console.error("Refresh status error:", error);
    }
  }, [user]);

  const sendOTP = useCallback(async (type: AuthMethod, value: string) => {
    setPendingAuth({ type, value });
    try {
      return { success: false, message: "OTP flow not implemented yet." };
    } catch (error: any) {
      return { success: false, message: "Network error. Please try again." };
    }
  }, []);

  const verifyOTP = useCallback(async (code: string) => {
    try {
      return {
        success: false,
        message: "OTP verification not implemented yet.",
      };
    } catch (error: any) {
      return { success: false, message: "Network error. Please try again." };
    }
  }, []);

  const updateProfile = useCallback(
    async (profile: Partial<User>) => {
      if (!user) {
        return { success: false, message: "Not authenticated" };
      }

      try {
        const baseUrl = getApiUrl();
        const response = await fetch(
          new URL("/api/auth/update-profile", baseUrl).href,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid, ...profile }),
          },
        );

        const data = await response.json();

        if (data.success) {
          const updatedUser = { ...user, ...profile };
          await saveUser(updatedUser);
        }

        return data;
      } catch (error: any) {
        console.error("Update profile error:", error);
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [user],
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        pendingAuth,
        signUp,
        signIn,
        sendOTP,
        verifyOTP,
        resendVerification,
        checkEmailVerified,
        submitSelfie,
        refreshUserStatus,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signUp: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      pendingAuth: null,
      signIn: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      sendOTP: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      verifyOTP: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      resendVerification: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      checkEmailVerified: async () => false,
      submitSelfie: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      refreshUserStatus: async () => {},
      updateProfile: async () => ({
        success: false,
        message: "Auth provider not ready",
      }),
      logout: async () => {},
    };
  }
  return context;
}
