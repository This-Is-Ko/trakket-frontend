<template>
  <div class="landing">
    <!-- ===== Header Bar ===== -->
    <header class="absolute top-0 left-0 right-0 z-50">
      <div class="max-w-[1600px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold text-white"
            style="background: var(--p-button-primary-background)"
          >
            T
          </div>
          <span class="text-lg font-bold text-white tracking-tight">TRAKKET</span>
        </NuxtLink>

        <!-- Login / Dashboard (client-only to avoid hydration mismatch with prerendered page) -->
        <ClientOnly>
          <NuxtLink
            v-if="!userStore.isLoggedIn"
            to="/login"
            class="text-sm font-semibold text-white transition-colors duration-200 px-4 py-2 rounded-full"
            style="background: var(--p-button-primary-background)"
          >
            Login
          </NuxtLink>
          <NuxtLink
            v-else
            to="/favourites"
            class="text-sm font-semibold text-white transition-colors duration-200 px-4 py-2 rounded-full"
            style="background: var(--p-button-primary-background)"
          >
            Dashboard
          </NuxtLink>
          <template #fallback>
            <span class="text-sm font-semibold text-white px-4 py-2 rounded-full" style="background: var(--p-button-primary-background)">
              Login
            </span>
          </template>
        </ClientOnly>
      </div>
    </header>

    <!-- ===== Hero Content ===== -->
    <div class="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-12">
      <!-- Subtle background glow -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style="background: radial-gradient(circle, var(--p-button-primary-background), transparent 70%)"
        ></div>
      </div>

      <!-- Example event cards around the hero -->
      <LandingHeroEventCards
        :football-events="footballPreviewEvents"
        :motorsport-events="motorsportPreviewEvents"
      />

      <div class="relative z-10 flex flex-col items-center text-center max-w-xl lg:max-w-2xl">
        <!-- Main Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
          Track every
          <br />
          <span class="hero-accent">sporting event</span>
          <br />
          you watch.
        </h1>

        <!-- Subtitle -->
        <p class="mt-6 text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed">
          Log every football match and motorsport race you watch. Understand your viewing habits with rich statistics — all in one place.
        </p>

        <!-- Bottom Get Started (client-only to avoid hydration mismatch with prerendered page) -->
        <ClientOnly>
          <Button
            label="Get Started"
            as="router-link"
            :to="userStore.isLoggedIn ? '/favourites' : '/login'"
            rounded
            size="large"
            class="mt-8 !px-10 !py-4 !text-base !font-semibold"
          />
          <template #fallback>
            <Button
              label="Get Started"
              rounded
              size="large"
              class="mt-8 !px-10 !py-4 !text-base !font-semibold"
            />
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/5 py-8 px-6">
      <div class="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-extrabold text-white"
            style="background: var(--p-button-primary-background)"
          >
            T
          </div>
          <span class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} Trakket. All rights reserved.</span>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">About</NuxtLink>
          <NuxtLink to="/privacy-policy" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy</NuxtLink>
          <a href="mailto:sportswatchtracker@gmail.com" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import LandingHeroEventCards from '~/components/landing/HeroEventCards.vue'
import { useUserStore } from '~/stores/useUserStore'
import { useLandingPreviewEvents } from '~/composables/useLandingPreviewEvents'

const userStore = useUserStore()

const { footballEvents: footballPreviewEvents, motorsportEvents: motorsportPreviewEvents } =
  useLandingPreviewEvents()

definePageMeta({
  public: true,
  title: 'Home',
  layout: 'landing',
})

useSeoMeta({
  title: 'Trakket — Track Every Sporting Event You Watch',
  description: 'Log matches, races, and games across all sports. Understand your viewing habits with rich statistics.',
  ogTitle: 'Trakket — Track Every Sporting Event You Watch',
  ogDescription: 'Log matches, races, and games across all sports. Understand your viewing habits with rich statistics.',
  ogImage: '/favicon-32x32.png',
  ogUrl: 'https://www.trakket.com/',
})
</script>

<style scoped>
.landing {
  min-height: 100vh;
}

.hero-accent {
  color: var(--p-button-primary-background);
}
</style>
