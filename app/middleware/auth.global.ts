import { useAuth } from '~/composables/useAuth'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuth()

    // Pages allowed without login
    const publicPages = ['/', '/signup', '/login', '/about']

    if (!auth.isLoggedIn.value && !publicPages.includes(to.path)) {
        // Redirect unauthenticated users to login page
        return navigateTo('/login')
    }
})
