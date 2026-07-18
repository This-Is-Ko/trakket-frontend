<template>
  <div class="relative text-gray-100 py-12">
    <!-- Subtle background glow behind hero -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style="background: radial-gradient(circle, var(--p-button-primary-background), transparent 70%)"
      ></div>
    </div>

    <!-- Hero Section -->
    <section class="relative z-10 text-center pt-8 pb-6">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
          About <span class="font-extrabold" style="color: var(--p-button-primary-background)">Trakket</span>
        </h1>
        <p class="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Trakket helps you log every match you've watched — football matches, motorsport races, or highlights — and gives you insights into your sports viewing habits.
        </p>
      </div>
    </section>

    <!-- Why Trakket Exists -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 py-8">
      <h2 class="text-3xl font-extrabold tracking-tight text-center mb-6 text-white">Why I Built Trakket</h2>
      <p class="text-center text-gray-400 max-w-3xl mx-auto leading-relaxed">
        I created Trakket because I wanted to remember which matches I had watched — something I couldn't track with regular sports apps. It began with logging football matches and motorsport races, and then grew into something more: a personal sports viewing tracker to reflect on your watch history and habits.
      </p>
    </section>

    <!-- Supported Sports -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 py-8">
      <h2 class="text-3xl font-extrabold tracking-tight text-center mb-6 text-white">Supported Sports &amp; Competitions</h2>
      <p class="text-center text-gray-400 max-w-3xl mx-auto leading-relaxed">
        Trakket currently supports logging of both football and motorsport, covering popular competitions like the Premier League, La Liga, Formula 1, and more. We're continuously expanding — more sports and leagues are coming soon, including additional football and racing series.
      </p>
    </section>

    <!-- What Makes Trakket Different -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 py-8">
      <h2 class="text-3xl font-extrabold tracking-tight text-center mb-8 text-white">How Trakket Stands Out</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="group rounded-2xl p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 bg-gray-950/60 border border-white/5">
          <h3 class="text-xl font-bold mb-2 text-white">Personal Match Tracking</h3>
          <p class="text-gray-400 leading-relaxed">
            Unlike apps that just show scores or schedules, Trakket focuses on the matches you have watched — making it easy to keep a record of your viewing activity over time.
          </p>
        </div>
        <div class="group rounded-2xl p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 bg-gray-950/60 border border-white/5">
          <h3 class="text-xl font-bold mb-2 text-white">Insights into Viewing Habits</h3>
          <p class="text-gray-400 leading-relaxed">
            Trakket helps you understand your watching patterns — like your favorite leagues, frequency of viewings, and trends over time — all in one place.
          </p>
        </div>
      </div>
    </section>

    <!-- Developer Section -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight mb-4 text-white">About the Developer</h2>
      <p class="text-gray-400 mb-4">
        Trakket is developed and maintained by a single independent developer.
      </p>
      <p class="text-gray-400">
        Got feedback or ideas? Reach out at
        <a href="mailto:sportswatchtracker@gmail.com" class="underline transition-colors hover:text-white" style="color: var(--p-button-primary-background)">
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
  description: "Learn about Trakket — a personal sports viewing tracker for logging football and motorsport matches you've watched, with insights into your watching habits.",
  ogTitle: "About Trakket",
  ogDescription: "Discover how Trakket helps you log the football matches and motorsport races you've watched and gain insights into your sports viewing history.",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com/about",
})
</script>
