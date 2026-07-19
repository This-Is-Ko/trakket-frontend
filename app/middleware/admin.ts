import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserStore } from "~/stores/useUserStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserStore()
    if (process.client) {
        await userStore.checkAuth()
        if (!userStore.isLoggedIn) {
            return navigateTo({
                path: '/login',
                query: { redirectMessage: 'Login required to access admin panel' }
            });
        }
        if (!userStore.isAdmin) {
            return navigateTo('/favourites');
        }
    }
})
