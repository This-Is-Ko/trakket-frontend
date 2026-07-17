<template>
  <footer class="border-t border-white/5 py-8 px-6 bg-gray-950">
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
</template>
