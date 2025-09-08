<template>
  <div class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Hero Section -->
    <section class="relative text-center pt-20 pb-6">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight">
          About <span class="font-extrabold" style="color: var(--p-button-primary-background)">Trakket</span>
        </h1>
        <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Trakket helps you log every match you’ve watched — football matches, motorsport races, or highlights — and gives you insights into your sports viewing habits.
        </p>
      </div>
    </section>

    <!-- Why Trakket Exists -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-6">
      <h2 class="text-3xl font-bold text-center mb-8">Why I Built Trakket</h2>
      <p class="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        I created Trakket because I wanted to remember which matches I had watched — something I couldn’t track with regular sports apps. It began with logging football matches and motorsport races, and then grew into something more: a personal sports viewing tracker to reflect on your watch history and habits.
      </p>
    </section>

    <!-- Supported Sports -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-6">
      <h2 class="text-3xl font-bold text-center mb-8">Supported Sports & Competitions</h2>
      <p class="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        Trakket currently supports logging of both football and motorsport, covering popular competitions like the Premier League, La Liga, Formula 1, and more. We’re continuously expanding — more sports and leagues are coming soon, including basketball, tennis, and additional football and racing series.
      </p>
    </section>

    <!-- What Makes Trakket Different -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-6">
      <h2 class="text-3xl font-bold text-center mb-8">How Trakket Stands Out</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-2">Personal Match Tracking</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Unlike apps that just show scores or schedules, Trakket focuses on the matches <strong>you</strong> have watched — making it easy to keep a record of your viewing activity over time.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-2">Insights into Viewing Habits</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Trakket helps you understand your watching patterns — like your favorite leagues, frequency of viewings, and trends over time — all in one place.
          </p>
        </div>
      </div>
    </section>

    <!-- Developer Section -->
    <section class="max-w-4xl mx-auto px-6 py-12 text-center">
      <h2 class="text-2xl font-bold mb-4">About the Developer</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Trakket is developed and maintained by a single independent developer.
      </p>
      <p class="text-gray-700 dark:text-gray-300">
        Got feedback or ideas? Reach out at
        <a href="mailto:sportswatchtracker@gmail.com" class="text-indigo-500 underline">
          sportswatchtracker@gmail.com
        </a>.
      </p>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  public: true,
  title: 'About'
})

useSeoMeta({
  title: "About Trakket",
  description: "Learn about Trakket — a personal sports viewing tracker for logging football and motorsport matches you’ve watched, with insights into your watching habits.",
  ogTitle: "About Trakket",
  ogDescription: "Discover how Trakket helps you log the football matches and motorsport races you’ve watched and gain insights into your sports viewing history.",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com/about",
})
</script>
