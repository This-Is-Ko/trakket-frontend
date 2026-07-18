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
        },
        reject() {
            this.consent = 'rejected';
        },
    },
    persist: true,
});
