import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    app: {
        head: {
            title: "Trakket",
            htmlAttrs: {
                lang: 'en',
            },
        },
        // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    site: {
        url: 'https://trakket.com',
        name: 'Trakket',
        description: 'Track your sports viewing. All in one place.',
        defaultLocale: 'en',
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
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
    }
})