<template>
  <footer class="bg-gray-900 text-gray-300 py-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Info -->
      <div>
        <h3 class="text-lg font-bold text-white mb-3">Trakket</h3>
        <p class="text-sm">Track the sports you’ve watched. Understand your viewing habits. All in one place.</p>
      </div>

      <!-- Quick Links -->
      <nav aria-label="Footer quick links">
        <h4 class="text-md font-semibold text-white mb-3">Quick Links</h4>
        <ul class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm leading-6">
          <li>
            <NuxtLink
                to="/signup"
                class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              Sign Up
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
                to="/login"
                class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              Login
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
                to="/about"
                class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              About
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
                to="/privacy-policy"
                class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              Privacy Policy
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Future Plans -->
      <div>
        <h4 class="text-md font-semibold text-white mb-2">Future Plans</h4>
        <p class="text-sm">
          Currently supporting football, with more sports coming soon — Formula 1, basketball, and more.
        </p>
      </div>

      <!-- Contact Us -->
      <div>
        <h4 class="text-md font-semibold text-white mb-2">Contact Us</h4>
        <p class="text-sm">
          Have questions, feedback or feature ideas? Feel free to reach out:
          <a href="mailto:sportswatchtracker@gmail.com" class="text-indigo-400 underline">Contact</a>
        </p>
      </div>
    </div>

    <div class="mt-10 text-center text-sm text-gray-500">
      © {{ new Date().getFullYear() }} Trakket. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
