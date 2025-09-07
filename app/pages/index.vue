<template>
  <div class="text-gray-900 dark:text-gray-100">
    <!-- Hero Section -->
    <section class="relative text-center py-24 pb-12">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Main heading -->
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight">
          The sports viewing tracker
          <span class="block font-extrabold" style="color: var(--p-button-primary-background)">
            you’ve been waiting for
          </span>
        </h1>

        <!-- Subheading -->
        <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Trakket helps you log every match you’ve watched — live, replay, or
          highlights — and gives you insights into your sports viewing habits.
        </p>

        <!-- CTA buttons -->
        <div class="mt-8 flex justify-center gap-4">
          <Button
              label="Get Started"
              as="router-link"
              :to="userStore.isLoggedIn ? '/football' : '/signup'"
              rounded
              class="!px-6 !py-3 !text-lg bg-indigo-600 text-white hover:bg-indigo-700"
          />
          <Button
              label="About"
              as="router-link"
              to="/about"
              rounded
              class="!px-6 !py-3 !text-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          />
        </div>

        <div class="mt-16 flex justify-center">
          <div class="w-full md:w-4/5 h-72 bg-gray-900 rounded-xl shadow-lg">
            <div class="flex items-center px-4 py-2 bg-gray-800 rounded-t-xl">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="ml-auto text-xs text-gray-400">Trakket</span>
            </div>
            <div>
              <!-- Desktop Image -->
              <img
                  src="/landing-page-hero.png"
                  alt="Trakket Preview"
                  class="hidden md:block w-full h-auto"
              />

              <!-- Mobile Image -->
              <img
                  src="/landing-page-hero-mobile.png"
                  alt="Trakket Mobile Preview"
                  class="block md:hidden w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Carousel Section -->
    <div class="mt-6 max-w-5xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-center mb-12">
        Supported Leagues & Sports
      </h2>
      <Carousel
          :value="leagues"
          :numVisible="3"
          :numScroll="1"
          :circular="true"
          :autoplayInterval="3000"
          :responsiveOptions="responsiveOptions"
          class="custom-carousel"
      >
        <template #item="slotProps">
          <div class="text-center mx-2">
            <h3 class="text-lg font-semibold">{{ slotProps.data.league }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ slotProps.data.sport }}</p>
          </div>
        </template>
      </Carousel>
    </div>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 pt-12 pb-16">
      <h2 class="text-3xl font-bold text-center mb-12">Why Use Trakket?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition"
        >
          <i class="pi pi-calendar text-4xl text-indigo-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Log Your Matches</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Record every event you’ve watched with simple options: in person,
            live, replay, or highlight.
          </p>
        </div>
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition"
        >
          <i class="pi pi-chart-line text-4xl text-green-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Analyze Your Stats</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Discover patterns — leagues you follow most, games watched per
            month, and more.
          </p>
        </div>
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition"
        >
          <i class="pi pi-stopwatch text-4xl text-cyan-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">All In One Place</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Your sports viewing history is organized and ready to revisit any
            time.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/useUserStore";
const userStore = useUserStore();

const leagues = ref([
  { league: "English Premier League", sport: "Football" },
  { league: "La Liga", sport: "Football" },
  { league: "Women's Super League", sport: "Football" },
  { league: "Serie A", sport: "Football" },
  { league: "Bundesliga", sport: "Football" },
  { league: "Formula 1", sport: "Motorsport" }
]);

const responsiveOptions = ref([
  {
    breakpoint: "1024px",
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: "768px",
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: "560px",
    numVisible: 1,
    numScroll: 1
  }
]);

definePageMeta({
  public: true,
  title: "Home",
});
</script>
