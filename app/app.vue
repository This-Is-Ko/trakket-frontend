<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Trakket` : 'Trakket';
  },
  link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
  ],
})
</script>
