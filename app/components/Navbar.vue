<template>
  <div class="w-full bg-white shadow">
    <div class="max-w-7xl mx-auto px-6">
      <Menubar :model="menuItems" class="w-full">

        <template #item="{ item, props }">
          <NuxtLink
              :to="item.to"
              class="p-menuitem-link"
              v-bind="props.action"
              :class="{ 'active-link': route.path === item.to }"
          >
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>

        <!-- Right side (auth actions) -->
        <template #end>
          <div v-if="auth.isLoggedIn.value">
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
import { useAuth } from "~/composables/useAuth";
import { useRouter, useRoute } from "vue-router";

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const menu = ref(null);

const toggleMenu = (event) => {
  menu.value.toggle(event);
};

const menuItems = [
  { label: "Home", to: "/" },
  { label: "Football", to: "/football" },
  { label: "Motorsport", to: "/motorsport" },
  { label: "Statistics", to: "/football/statistics" }
];

const userMenu = [
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => {
      auth.logout();
      router.push("/");
    }
  }
];
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
