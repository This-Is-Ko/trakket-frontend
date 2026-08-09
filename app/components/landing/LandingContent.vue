<template>
  <div class="relative z-10 overflow-hidden">
    <!-- Subtle background glow behind content -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.06]"
        style="background: radial-gradient(circle, var(--p-button-primary-background), transparent 70%)"
      ></div>
    </div>

    <!-- ===== What is Trakket? ===== -->
    <section class="relative max-w-3xl mx-auto px-6 pt-6 sm:pt-10 pb-12 text-center">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">What is Trakket?</h2>
      <p class="mt-6 text-lg text-gray-400 leading-relaxed">
        Trakket is a personal sports viewing tracker. Log every football match and motorsport race you
        watch, then explore your viewing history with detailed statistics — all in one place.
      </p>
    </section>

    <!-- ===== Feature Grid ===== -->
    <section class="relative max-w-6xl mx-auto px-6 pb-12 sm:pb-16">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-10 text-white">
        Everything you need to track your viewing
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group rounded-2xl p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 bg-gray-950/60 border border-white/5"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
            style="background: color-mix(in srgb, var(--p-button-primary-background) 12%, transparent); color: var(--p-button-primary-background)"
          >
            <i :class="feature.icon"></i>
          </div>
          <h3 class="text-lg font-bold mb-2 text-white">{{ feature.title }}</h3>
          <p class="text-sm text-gray-400 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- ===== How It Works ===== -->
    <section class="relative max-w-5xl mx-auto px-6 py-12 sm:py-16">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-12 text-white">How It Works</h2>
      <ol class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="relative flex flex-col items-center text-center"
        >
          <span
            class="text-5xl font-extrabold tracking-tight select-none"
            style="color: color-mix(in srgb, var(--p-button-primary-background) 35%, transparent)"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-3 text-xl font-bold text-white">{{ step.title }}</h3>
          <p class="mt-2 text-gray-400 leading-relaxed max-w-xs">{{ step.description }}</p>
        </li>
      </ol>
    </section>

    <!-- ===== More Sports Coming Soon ===== -->
    <section class="relative max-w-3xl mx-auto px-6 py-12 sm:py-16 text-center">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">More Sports Coming Soon</h2>
      <p class="mt-6 text-lg text-gray-400 leading-relaxed">
        Trakket currently covers football and motorsport, with plans to expand into more sports over time.
        Have a sport you'd love to see? We'd love to hear from you.
      </p>
      <a
        href="mailto:sportswatchtracker@gmail.com"
        class="inline-flex items-center gap-2 mt-8 px-8 py-3 rounded-full text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
        style="background: var(--p-button-primary-background)"
      >
        Send us your suggestions
        <i class="pi pi-arrow-right text-sm"></i>
      </a>
    </section>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'pi pi-verified',
    title: 'Log What You Watch',
    description:
      'Track every football match or motorsport race you\'ve seen. Mark events as watched live, on replay, or as highlights with a single click.',
  },
  {
    icon: 'pi pi-globe',
    title: 'Comprehensive Football Coverage',
    description:
      'From the Premier League to La Liga, Bundesliga, Serie A and beyond — log matches across leagues and competitions worldwide.',
  },
  {
    icon: 'pi pi-bolt',
    title: 'Full Motorsport Support',
    description:
      'Track Formula 1, MotoGP, and other racing series. Log race results, winners, and circuit details in one place.',
  },
  {
    icon: 'pi pi-chart-bar',
    title: 'Personal Statistics',
    description:
      'Discover your most-watched leagues, favourite teams, viewing streaks, and seasonal trends with rich visual insights.',
  },
  {
    icon: 'pi pi-history',
    title: 'Watch History Timeline',
    description:
      'Browse your complete viewing history. See exactly which matches and races you\'ve watched, organised by date and competition.',
  },
  {
    icon: 'pi pi-star',
    title: 'Always Improving',
    description:
      'New sports, leagues, and features are added regularly based on community feedback.',
  },
]

const steps = [
  {
    title: 'Create your account',
    description: 'Sign up in seconds using your Google account.',
  },
  {
    title: 'Log your matches',
    description: 'Browse upcoming and past events. Mark them as watched with one click.',
  },
  {
    title: 'Explore your stats',
    description: 'Dive into your personal dashboard and discover patterns, trends, and viewing insights.',
  },
]
</script>
