import { defineStore } from 'pinia';
import { createApi } from "~/services/api";

export const useUserStore = defineStore('user', {
    state: () => ({
        username: null as string | null,
        isLoggedIn: false,
        showLoginDialog: false,
        role: null as string | null
    }),
    getters: {
        isAdmin: (state) => state.role === 'ROLE_ADMIN',
    },
    actions: {
        async login(email: string, password: string) {
            const api = createApi();
            try {
                const res = await api.post("/api/auth/login", {
                    email,
                    password,
                });
                this.username = res.data.username ?? null;
                this.isLoggedIn = true;
                this.role = res.data.role ?? null;

                // Sync favourites from backend after login
                const { useFavouriteStore } = await import('~/stores/useFavouriteStore')
                const favouriteStore = useFavouriteStore()
                await favouriteStore.syncFromBackend()
                // Sync consent from backend after login
                const { useCookieConsentStore } = await import('~/stores/useCookieConsentStore');
                const consentStore = useCookieConsentStore();
                await consentStore.syncToBackend();
            } catch (err: any) {
                this.username = null;
                this.isLoggedIn = false;
                this.role = null;
                throw new Error(err.response?.data?.message || "Login failed");
            }
        },
        async googleLogin(idToken: string) {
            const api = createApi();
            try {
                const res = await api.post("/api/auth/google", {
                    idToken,
                });
                this.username = res.data.username ?? null;
                this.isLoggedIn = true;
                this.role = res.data.role ?? null;

                // Sync favourites from backend after login
                const { useFavouriteStore } = await import('~/stores/useFavouriteStore')
                const favouriteStore = useFavouriteStore()
                await favouriteStore.syncFromBackend()
                // Sync consent from backend after login
                const { useCookieConsentStore } = await import('~/stores/useCookieConsentStore');
                const consentStore = useCookieConsentStore();
                await consentStore.syncToBackend();
            } catch (err: any) {
                this.username = null;
                this.isLoggedIn = false;
                throw new Error(err.response?.data?.message || "Google login failed");
            }
        },
        async checkAuth() {
            const api = createApi();
            try {
                const res = await api.get("/api/auth/me");
                this.username = res.data.username ?? null;
                this.isLoggedIn = true;
                this.role = res.data.role ?? null;

                // Hydrate consent from backend (takes precedence over localStorage)
                const { useCookieConsentStore } = await import('~/stores/useCookieConsentStore');
                const consentStore = useCookieConsentStore();
                consentStore.hydrateFromBackend(res.data.consent?.status ?? null);
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    this.username = null;
                    this.isLoggedIn = false;
                } else {
                    console.warn("Auth check failed due to network/server error", err);
                }
                return false;
            }
        },
        async logout() {
            const api = createApi();
            this.username = null;
            this.isLoggedIn = false;
            this.role = null;
            await api.post("/api/auth/logout", {}).catch(() => {});
        },
    },
    persist: true,
});
