<template>
  <div class="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <section class="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-20 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div>
          <h1 class="text-5xl font-extrabold leading-tight">
            Your Personal Sports Watch Log
          </h1>
          <p class="mt-6 text-lg text-gray-100">
            Keep track of every game you watch — live, replay, or highlights —
            and unlock insights into your sports viewing habits.
          </p>
          <div class="mt-8 flex gap-4">
            <Button
                label="Get Started"
                as="router-link"
                :to="userStore.isLoggedIn ? '/football' : '/signup'"
                rounded
                class="!px-6 !py-3 !text-lg"
            />
          </div>
        </div>

        <div class="flex justify-center md:justify-end">
<!--          <img src="/images/landing/hero-sports.png" alt="Sports Tracker Preview" class="w-10/12 md:w-9/12 rounded-xl shadow-lg" />-->
          <div class="w-10/12 md:w-9/12 h-64 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-lg"></div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 lg:px-20 py-20">
      <h2 class="text-3xl font-bold text-center mb-12">Why Use Sports Watch Tracker?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-calendar text-4xl text-indigo-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Log Your Matches</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Record each event you’ve watched with simple options: live, replay, or highlight.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-chart-line text-4xl text-green-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Analyze Your Stats</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Discover patterns — which leagues you follow most, how many games you watch monthly, and more.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <i class="pi pi-stopwatch text-4xl text-cyan-500 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">All In One Place</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Your sports viewing history is organized and easy to revisit whenever you want.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "~/stores/useUserStore";
const userStore = useUserStore()

definePageMeta({
  public: true
})
</script>