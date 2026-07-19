import { defineStore } from 'pinia';

export type ConsentStatus = 'undecided' | 'accepted' | 'rejected';

export const useCookieConsentStore = defineStore('cookieConsent', {
    state: () => ({
        /** 'undecided' | 'accepted' | 'rejected' */
        consent: 'undecided' as ConsentStatus,
    }),
    getters: {
        isVisible(state): boolean {
            return state.consent === 'undecided';
        },
        hasAccepted(state): boolean {
            return state.consent === 'accepted';
        },
        hasRejected(state): boolean {
            return state.consent === 'rejected';
        },
    },
    actions: {
        accept() {
            this.consent = 'accepted';
            this.syncToBackend();
        },
        reject() {
            this.consent = 'rejected';
            this.syncToBackend();
        },

        async syncToBackend() {
            const { useUserStore } = await import('~/stores/useUserStore');
            const userStore = useUserStore();
            if (!userStore.isLoggedIn || this.consent === 'undecided') return;
            const { createApi } = await import('~/services/api');
            const api = createApi();
            try {
                await api.put('/api/user/consent', { status: this.consent.toUpperCase() });
            } catch {
                // silent — localStorage is fallback
            }
        },

        hydrateFromBackend(status: 'ACCEPTED' | 'REJECTED' | null) {
            if (status === null) return;
            const mapped = status.toLowerCase() as ConsentStatus;
            if (this.consent !== mapped) {
                this.consent = mapped;
            }
        },
    },
    persist: true,
});
