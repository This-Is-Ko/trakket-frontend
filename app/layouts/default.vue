<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">
    <Navbar />

    <main
        :class="[
          'w-full max-w-7xl mx-auto flex-1 flex flex-col gap-6',
          route.path !== '/' && route.path !== '/about' ? 'p-6' : ''
        ]"
    >
      <slot />
    </main>


    <!-- Token expired dialog -->
    <Dialog
        header="Session Expired"
        v-model:visible="userStore.showLoginDialog"
        modal
        :closable="false"
    >
      <p>Your session has expired. Please log in again.</p>
      <template #footer>
        <Button label="Login" @click="redirectToLogin" />
      </template>
    </Dialog>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
import { useRoute } from "vue-router";
import {useRouter} from "#vue-router";

const router = useRouter();
const route = useRoute();

import {useUserStore} from "~/stores/useUserStore";
const userStore = useUserStore()

const redirectToLogin = async () => {
  userStore.showLoginDialog = false;
  await router.push("/login");
};

useHead({
  meta: [{ property: 'og:title', content: `${route.meta.title} | Trakket` }]
})
</script>
