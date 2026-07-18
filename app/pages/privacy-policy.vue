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
          Privacy Policy
        </h1>
        <p class="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          At <span class="font-extrabold" style="color: var(--p-button-primary-background)">Trakket</span>, we respect your privacy and are committed to being transparent about how we handle your data. This page explains what information we collect, why we collect it, and how it is used.
        </p>
      </div>
    </section>

    <!-- Policy sections -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">1. Information We Collect</h2>
        <p class="mb-2 text-gray-400">
          We collect only the data necessary to provide you with a secure and reliable experience. This may include:
        </p>
        <ul class="list-disc list-inside space-y-1 text-gray-400">
          <li>Account information such as email and username when you register or log in.</li>
          <li>Cookies for authentication, session management, and analytics.</li>
          <li>Anonymous usage data that helps us improve the platform.</li>
        </ul>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">2. Cookies and Sessions</h2>
        <p class="mb-2 text-gray-400">We use cookies for the following purposes:</p>
        <ul class="list-disc list-inside space-y-1 text-gray-400">
          <li><span class="font-semibold text-gray-200">Login &amp; Authentication:</span> To securely keep you signed in and manage your session.</li>
          <li><span class="font-semibold text-gray-200">Analytics:</span> To understand how users interact with Trakket and to improve features.</li>
        </ul>
        <p class="mt-2 text-gray-400">
          These cookies do not track your activity outside of Trakket and are never shared with third parties for advertising purposes.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">3. How We Use Your Data</h2>
        <p class="text-gray-400">
          Data collected is used solely to provide and improve the Trakket service. We do not sell your personal data. Any analytics are aggregated and anonymized.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">4. Third-Party Services</h2>
        <p class="text-gray-400">
          Trakket may use trusted third-party services (such as analytics providers or hosting platforms) to operate the service. These providers are only given the minimum data required and are not permitted to use it for other purposes.
        </p>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">5. Your Choices</h2>
        <ul class="list-disc list-inside space-y-1 text-gray-400">
          <li>You may clear cookies from your browser at any time, though this will log you out of Trakket.</li>
          <li>You may request deletion of your account and associated data by contacting support.</li>
        </ul>
      </section>

      <section class="rounded-2xl p-6 backdrop-blur-sm bg-gray-950/60 border border-white/5">
        <h2 class="text-2xl font-bold mb-3 text-white">6. Updates</h2>
        <p class="text-gray-400">
          We may update this policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.
        </p>
      </section>

      <p class="text-sm text-gray-500 pt-2">
        Last Updated: July 2026
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  public: true,
  title: 'Privacy Policy'
})

useSeoMeta({
  title: "Privacy Policy - Trakket",
  description: "Read the Trakket Privacy Policy. Learn how we use cookies, authentication, and analytics to improve your experience.",
  ogTitle: "Privacy Policy - Trakket",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com/privacy-policy",
})
</script>
