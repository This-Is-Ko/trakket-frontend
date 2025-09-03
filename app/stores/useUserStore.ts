import { defineStore } from 'pinia';
import api from "./../services/api"

export const useUserStore = defineStore('user', {
    state: () => ({
        username: null as string | null,
        isLoggedIn: false,
        showLoginDialog: false
    }),
    actions: {
        async login(email: string, password: string) {
            try {
                const res = await api.post("/api/auth/login", {
                    email,
                    password,
                });
                this.username = res.data.username ?? null;
                this.isLoggedIn = true;
            } catch (err: any) {
                this.username = null;
                this.isLoggedIn = false;
                throw new Error(err.response?.data?.message || "Login failed");
            }
        },
        async checkAuth() {
            try {
                const res = await api.get("/api/auth/me");
                this.username = res.data.username ?? null;
                this.isLoggedIn = true;
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    // user is not logged in
                    this.username = null;
                    this.isLoggedIn = false;
                } else {
                    // network/server error - keep previous state
                    console.warn("Auth check failed due to network/server error", err);
                }
                return false;
            }
        },
        async logout() {
            this.username = null;
            this.isLoggedIn = false;
            await api.post("/api/auth/logout", {}).catch(() => {});
        },
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
});
