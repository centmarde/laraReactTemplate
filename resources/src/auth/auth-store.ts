import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
    id: number;
    name: string | null;
    firstname: string | null;
    lastname: string | null;
    email: string;
    email_verified_at: string | null;
    is_2fa_enabled: boolean;
    userRole: unknown;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface RegisterPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_2fa_enabled?: boolean;
}

export interface LoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}

interface AuthResponse {
    userData: AuthUser;
    accessToken: string;
    requiresTwoFactor?: boolean;
    message?: string;
}

interface RequestResult<T> {
    ok: boolean;
    data: T;
}

async function request<T>(
    path: string,
    options: RequestInit,
): Promise<RequestResult<T>> {
    const res = await fetch(path, options);
    let data = {} as T;
    try {
        data = (await res.json()) as T;
    } catch {
        /* keep empty body */
    }
    return { ok: res.ok, data };
}

interface AuthStore {
    token: string | null;
    user: AuthUser | null;
    requiresTwoFactor: boolean;
    loading: boolean;
    error: string | null;
    login: (payload: LoginPayload) => Promise<AuthResponse | null>;
    register: (payload: RegisterPayload) => Promise<AuthResponse | null>;
    verifySms: (code: string) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const authHeaders = (token: string | null, extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...extra,
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

/**
 * Zustand auth store. Persists the token + user in localStorage so a page
 * refresh (and deep links) keep the session alive.
 */
export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            requiresTwoFactor: false,
            loading: false,
            error: null,

            login: async (payload) => {
                set({ loading: true, error: null });
                try {
                    const { ok, data } = await request<AuthResponse>(
                        "/api/login",
                        {
                            method: "POST",
                            headers: authHeaders(get().token, {
                                "Content-Type": "application/json",
                            }),
                            body: JSON.stringify(payload),
                        },
                    );
                    if (!ok) throw new Error(data.message || "Login failed");
                    set({
                        token: data.accessToken,
                        user: data.userData,
                        requiresTwoFactor: Boolean(data.requiresTwoFactor),
                    });
                    return data;
                } catch (err) {
                    set({
                        error:
                            err instanceof Error ? err.message : "Login failed",
                    });
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            register: async (payload) => {
                set({ loading: true, error: null });
                try {
                    const { ok, data } = await request<AuthResponse>(
                        "/api/register",
                        {
                            method: "POST",
                            headers: authHeaders(get().token),
                            body: JSON.stringify(payload),
                        },
                    );
                    if (!ok) throw new Error(data.message || "Registration failed");
                    set({
                        token: data.accessToken,
                        user: data.userData,
                        requiresTwoFactor: false,
                    });
                    return data;
                } catch (err) {
                    set({
                        error:
                            err instanceof Error
                                ? err.message
                                : "Registration failed",
                    });
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            verifySms: async (code) => {
                set({ loading: true, error: null });
                try {
                    const { ok, data } = await request<AuthResponse>(
                        "/api/verify/sms",
                        {
                            method: "POST",
                            headers: authHeaders(get().token),
                            body: JSON.stringify({ code }),
                        },
                    );
                    if (!ok) throw new Error(data.message || "SMS verification failed");
                    set({ user: data.userData, requiresTwoFactor: false });
                    return true;
                } catch (err) {
                    set({
                        error:
                            err instanceof Error
                                ? err.message
                                : "SMS verification failed",
                    });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                const { token } = get();
                if (token) {
                    try {
                        await fetch("/api/logout", {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    } catch {
                        /* session is cleared locally regardless */
                    }
                }
                set({
                    token: null,
                    user: null,
                    requiresTwoFactor: false,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ token: state.token, user: state.user }),
        },
    ),
);

/** A user is fully signed-in when we have them and no 2FA step is pending. */
export const selectIsAuthenticated = (s: AuthStore) =>
    !!s.user && !s.requiresTwoFactor;

/** True while the user must finish the SMS 2FA step. */
export const selectNeedsSms = (s: AuthStore) => !!s.user && s.requiresTwoFactor;

export type AuthState = AuthStore;
