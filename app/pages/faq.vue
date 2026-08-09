<template>
  <div class="relative text-gray-100 py-12">
    <!-- Subtle background glow behind header -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style="background: radial-gradient(circle, var(--p-button-primary-background), transparent 70%)"
      ></div>
    </div>

    <!-- Header section -->
    <section class="relative z-10 text-center pb-6">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
          Frequently Asked Questions
        </h1>
        <p class="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about <span class="font-extrabold" style="color: var(--p-button-primary-background)">Trakket</span> — how to track the matches and races you watch, what sports are supported, and how your data is handled.
        </p>
      </div>
    </section>

    <!-- FAQ sections -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">1. What is Trakket?</h2>
        <p class="text-gray-400 leading-relaxed">
          Trakket is a personal sports viewing tracker that lets you log every football match and motorsport race you've watched. Instead of just showing scores and schedules, Trakket builds a record of your watch history and turns it into statistics, so you can understand your viewing habits over time.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">2. Is Trakket free to use?</h2>
        <p class="text-gray-400 leading-relaxed">
          Yes — Trakket is completely free. All core features, including logging matches and races, tracking your watch history, and exploring your viewing statistics, are available at no cost.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">3. How do I start logging matches?</h2>
        <p class="mb-2 text-gray-400 leading-relaxed">Getting started takes less than a minute:</p>
        <ul class="list-disc list-inside space-y-1 text-gray-400">
          <li>Create a free account by signing up with your email or Google.</li>
          <li>Head to the <span class="font-semibold text-gray-200">Football</span> or <span class="font-semibold text-gray-200">Motorsport</span> section from your dashboard.</li>
          <li>Find the match or race you watched and mark it as watched.</li>
          <li>Your watch history is saved instantly and your statistics update automatically.</li>
        </ul>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">4. What sports and leagues are supported?</h2>
        <p class="mb-2 text-gray-400 leading-relaxed">
          Trakket currently supports football and motorsport:
        </p>
        <ul class="list-disc list-inside space-y-1 text-gray-400">
          <li><span class="font-semibold text-gray-200">Football:</span> Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and more.</li>
          <li><span class="font-semibold text-gray-200">Motorsport:</span> Formula 1, MotoGP, and other racing series.</li>
        </ul>
        <p class="mt-2 text-gray-400">
          We're continuously expanding — more sports and competitions are coming soon.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">5. Can I log a match I watched in the past?</h2>
        <p class="text-gray-400 leading-relaxed">
          Yes. Trakket lets you log any past match or race, so you can build a complete watch history even if you didn't start tracking from day one. Once logged, past viewings count toward your statistics just like new ones.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">6. What statistics can I see about my viewing?</h2>
        <p class="text-gray-400 leading-relaxed">
          Trakket turns your watch history into insights, including how often you watch, your most-watched leagues and competitions, favorite teams and drivers, monthly and yearly breakdowns, and viewing streaks. It's a great way to reflect on your sports viewing habits.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">7. How do I delete my account or data?</h2>
        <p class="text-gray-400 leading-relaxed">
          You can request deletion of your account and all associated data at any time by contacting us at
          <a href="mailto:sportswatchtracker@gmail.com" class="underline transition-colors hover:text-white" style="color: var(--p-button-primary-background)">
            sportswatchtracker@gmail.com
          </a>.
          We will permanently delete your account and watch history — we don't retain personal data after deletion.
        </p>
      </section>

      <p class="text-sm text-gray-500 pt-2">
        Still have questions? Reach out at
        <a href="mailto:sportswatchtracker@gmail.com" class="underline transition-colors hover:text-gray-300" style="color: var(--p-button-primary-background)">
          sportswatchtracker@gmail.com
        </a>.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  public: true,
  title: 'FAQ'
})

useSeoMeta({
  title: 'FAQ',
  description: "Answers to frequently asked questions about Trakket — how to log football matches and motorsport races you've watched, supported leagues, statistics, and account management.",
  ogTitle: 'FAQ — Trakket',
  ogDescription: "Everything you need to know about Trakket, the free sports viewing tracker. Learn how to track matches and races, what sports are supported, and how your data is handled.",
  ogImage: '/og-image.png',
  ogUrl: 'https://www.trakket.com/faq',
})
</script>
