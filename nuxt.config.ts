import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    app: {
        head: {
            title: "Trakket",
        },
        // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: [
        "@/assets/main.css"
    ],
    modules: [
        '@primevue/nuxt-module',
        "@pinia/nuxt",
        'pinia-plugin-persistedstate/nuxt'
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
    }
})