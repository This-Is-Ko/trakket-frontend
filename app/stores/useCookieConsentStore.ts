import { defineStore } from 'pinia';

export const useCookieConsentStore = defineStore('cookieConsent', {
    state: () => ({
        consented: false,
    }),
    getters: {
        isVisible(state): boolean {
            return !state.consented;
        },
    },
    actions: {
        accept() {
            this.consented = true;
        },
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
});
