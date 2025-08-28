import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import {useUserStore} from "~/stores/useUserStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserStore()
    if (process.client) {
        await userStore.checkAuth()
        // Public pages are defined in metadata
        if (!userStore.isLoggedIn && !to.meta.public) {
            // Redirect unauthenticated users to login page
            return navigateTo({
                path: '/login',
                query: { redirectMessage: 'Login to access this page' }
            });
        }
    }
})
