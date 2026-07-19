<template>
  <div class="w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
      <!-- Left: Logo + Navigation -->
      <div class="flex items-center gap-8">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <img
            class="w-8 h-8 object-contain"
            src="/FullLogo.png"
            alt="Trakket"
          />
          <span class="text-lg font-bold text-white tracking-tight">TRAKKET</span>
        </NuxtLink>

        <!-- Desktop Navigation links -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200"
            :class="navClass(item.to)"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Statistics dropdown -->
          <div class="relative">
            <button
              @click="toggleStatsMenu"
              class="px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-1 bg-transparent border-none cursor-pointer"
              :class="navClass('/statistics')"
            >
              Statistics
              <i class="pi pi-chevron-down text-xs"></i>
            </button>
            <Menu ref="statsMenu" :model="statsItems" popup />
          </div>
        </nav>
      </div>

      <!-- Right: Auth actions -->
      <div class="flex items-center gap-3">
        <!-- Mobile hamburger -->
        <Button
          icon="pi pi-bars"
          text
          class="!text-gray-400 hover:!text-white md:!hidden"
          @click="toggleMobileMenu"
        />
        <Menu ref="mobileMenuRef" :model="mobileMenuItems" popup />

        <template v-if="userStore.isLoggedIn">
          <span class="text-sm text-gray-300 hidden sm:inline">
            Hi {{ userStore.username || 'there' }}
          </span>
          <Menu ref="menu" :model="userMenu" popup />
          <Button
            icon="pi pi-user"
            text
            @click="toggleMenu"
            class="!text-gray-400 hover:!text-white"
          />
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/5"
          >
            Login
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "~/stores/useUserStore.js";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const menu = ref(null);
const statsMenu = ref(null);
const mobileMenuRef = ref(null);

const toggleMenu = (event) => {
  menu.value.toggle(event);
};

const toggleStatsMenu = (event) => {
  statsMenu.value.toggle(event);
};

const toggleMobileMenu = (event) => {
  mobileMenuRef.value.toggle(event);
};

const navItems = [
  { label: "Favourites", icon: "pi pi-star", to: "/favourites" },
  { label: "Football", to: "/football" },
  { label: "Motorsport", to: "/motorsport" },
];

const statsItems = [
  { label: "All", icon: "pi pi-chart-bar", command: () => router.push("/statistics") },
  { label: "Football", icon: "pi pi-fw pi-trophy", command: () => router.push("/statistics/football") },
  { label: "Motorsport", icon: "pi pi-fw pi-flag", command: () => router.push("/statistics/motorsport") },
];

// Mobile menu: combines nav links + stats sub-items
const mobileMenuItems = [
  { label: "Favourites", icon: "pi pi-star", command: () => router.push("/favourites") },
  { label: "⚽ Football", command: () => router.push("/football") },
  { label: "🏎️ Motorsport", command: () => router.push("/motorsport") },
  { separator: true },
  { label: "Statistics — All", icon: "pi pi-chart-bar", command: () => router.push("/statistics") },
  { label: "⚽ Statistics — Football", command: () => router.push("/statistics/football") },
  { label: "🏎️ Statistics — Motorsport", command: () => router.push("/statistics/motorsport") },
];

const toast = useToast();

const userMenu = computed(() => {
  const items = [
    {
      label: `Hi ${userStore.username || 'there'}`,
      icon: "pi pi-user",
      disabled: true,
    },
    { separator: true },
  ];

  if (userStore.isAdmin) {
    items.push({
      label: "Admin Panel",
      icon: "pi pi-cog",
      command: () => router.push("/admin"),
    });
    items.push({ separator: true });
  }

  items.push({
    label: "Logout",
    icon: "pi pi-sign-out",
    command: async () => {
      await userStore.logout();
      await router.push("/?loggedOut=true");
    }
  });

  return items;
});

const navClass = (path) => {
  const active = path === '/' ? route.path === path : route.path.startsWith(path);
  return active
    ? 'text-white bg-white/10'
    : 'text-gray-400 hover:text-white hover:bg-white/5';
};
</script>
