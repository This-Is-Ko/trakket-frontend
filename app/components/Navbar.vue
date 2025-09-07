<template>
  <ClientOnly>
    <Toast class="max-w-xs sm:max-w-sm" position="top-center" />
  </ClientOnly>
  <div class="w-full bg-white shadow">
    <div class="max-w-7xl mx-auto px-6">
      <Menubar :model="menuItems" class="w-full">

        <!-- Menu Item Slot -->
        <template #item="{ item, props, hasSubmenu }">
          <NuxtLink
              :to="item.to"
              class="p-menuitem-link flex items-center"
              v-bind="props.action"
              :class="{ 'active-link': isActive(item) }"
          >
            <span>{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-angle-down ml-1 text-sm"></span>
          </NuxtLink>
        </template>

        <!-- Right side (auth actions) -->
        <template #end>
          <div v-if="userStore.isLoggedIn">
            <Menu ref="menu" :model="userMenu" popup />
            <Button icon="pi pi-user" text @click="toggleMenu" />
          </div>
          <div v-else>
            <NuxtLink to="/login">
              <Button label="Login" icon="pi pi-sign-in" text />
            </NuxtLink>
          </div>
        </template>

      </Menubar>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "~/stores/useUserStore.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const menu = ref(null);

const toggleMenu = (event) => {
  menu.value.toggle(event);
};

const menuItems = [
  { label: "Home", to: "/" },
  { label: "Football", to: "/football" },
  { label: "Motorsport", to: "/motorsport" },
  {
    label: "Statistics",
    items: [
      { label: "Overall", to: "/statistics" },
      { label: "Football", to: "/statistics/football" },
      { label: "Motorsport", to: "/statistics/motorsport" }
    ]
  }
];

const toast = useToast();

const userMenu = [
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: async () => {
      await userStore.logout();
      toast.add({
        severity: "success",
        summary: "Logged out",
        life: 3000,
      });
      await router.push("/login");
    }
  }
];

// Active link helper
const isActive = (item) => {
  if (item.to) return route.path === item.to;
  if (item.items) return item.items.some(child => child.to === route.path);
  return false;
};
</script>

<style scoped>
.active-link {
  font-weight: bold;
  color: var(--primary-500);
}
:deep(.p-menubar) {
  border: none;
  background: transparent;
  box-shadow: none;
}
</style>
