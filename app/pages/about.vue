<template>
  <div class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Hero Section -->
    <section class="relative text-center pt-20 pb-6">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight">
          About <span class="font-extrabold" style="color: var(--p-button-primary-background)">Trakket</span>
        </h1>
        <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal companion for logging and analyzing the sports you watch.
          Track matches, explore viewing habits, and gain insights over time.
        </p>
      </div>
    </section>

    <!-- Goal Section -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-6">
      <h2 class="text-3xl font-bold text-center mb-8">Our Goal</h2>
      <p class="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        Trakket started as a personal log to track matches throughout the year.
        It has now grown into a platform for anyone who wants to monitor and
        analyze their sports-watching journey.
      </p>
    </section>

    <!-- Key Features -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-6">
      <h2 class="text-3xl font-bold text-center mb-8">Key Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-calendar text-4xl text-indigo-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Event Logging</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Record every match you watch, whether live, replay, or highlights.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-chart-line text-4xl text-green-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Personal Statistics</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Gain insights into your viewing habits, including leagues, competitions,
            and match counts over time.
          </p>
        </div>
      </div>
    </section>

    <!-- Future Features -->
    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-6">
      <h2 class="text-3xl font-bold text-center mb-8">Future Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-star text-4xl text-indigo-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">More Sports</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Support for additional leagues and sports like basketball, F1, and more.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-chart-bar text-4xl text-green-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Enhanced Stats</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Deeper analytics with advanced visualizations.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-bell text-4xl text-cyan-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Notifications</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Get reminders to log matches or follow favorite competitions.
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
          For support, inquiries, or feature ideas, reach out at
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
</script>
