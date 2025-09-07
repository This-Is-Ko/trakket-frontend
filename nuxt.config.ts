import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
            },
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            ],
        },
    },
    site: {
        url: 'https://www.trakket.com',
        name: 'Trakket',
        description: 'Track your sports viewing. All in one place.',
        defaultLocale: 'en',
    },
    ssr: true,
    nitro: {
    },
    routeRules: {
        // Public
        '/': { prerender: true },
        '/about': { prerender: true },

        // Auth related
        '/login': { ssr: true },
        '/signup': { ssr: true },

        // Private
        '/football/**': { ssr: false },
        '/motorsport/**': { ssr: false },
        '/statistics/**': { ssr: false },
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    css: [
        "@/assets/main.css"
    ],
    modules: [
      '@primevue/nuxt-module',
      "@pinia/nuxt",
      'pinia-plugin-persistedstate/nuxt',
      "@nuxtjs/seo"
    ],
    primevue: {
        options: {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: ".p-dark",
                }
            },
            ripple: false
        },
        autoImport: true
    },
    vite: {
        plugins: [
            tailwindcss(),
        ]
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8080" as string,
        },
    },
})