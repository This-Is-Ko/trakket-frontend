<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { useFavouriteStore } from '~/stores/useFavouriteStore'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Trakket` : 'Trakket';
  },
  link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
  ],
})

useSeoMeta({
  title: "Trakket",
  description: "Trakket helps you log every match you watch and gives you insights into your sports viewing habits.",
  ogTitle: "Trakket - Track the sports you watch",
  ogDescription: "Track the sports you’ve watched. Understand your viewing habits. All in one place.",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com",
  twitterCard: "summary_large_image",
  twitterTitle: "Trakket - Track the sports you watch",
  twitterDescription: "Track the sports you’ve watched. Understand your viewing habits. All in one place.",
  twitterImage: '/favicon-32x32.png',
})

onMounted(() => {
  const userStore = useUserStore()
  if (userStore.isLoggedIn) {
    const favouriteStore = useFavouriteStore()
    favouriteStore.syncFromBackend()
  }
})
</script>
