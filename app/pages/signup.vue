<template>
  <div class="flex flex-col justify-center items-center bg-gray-100 px-4"
       :style="{ minHeight: 'calc(100vh - 64px)' }">
    <h2 class="text-3xl font-bold mb-6 text-center">Sign Up</h2>

    <div class="w-full max-w-sm text-center">
      <p class="text-gray-700 mb-4">
        New account registration is now done through Google Sign-In.
      </p>
      <p class="text-gray-700 mb-6">
        Go to the login page and click "Sign in with Google" to create your account.
      </p>

      <NuxtLink to="/login">
        <Button label="Go to Login" class="w-full" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  public: true,
  title: 'Sign Up'
})

useSeoMeta({
  title: "Sign Up for Trakket",
  description: "Create your Trakket account using Google Sign-In and start tracking your sports viewing habits.",
  ogTitle: "Sign Up for Trakket",
  ogDescription: "Sign up for Trakket with Google and track every sports match you watch.",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com/signup"
})
</script>
