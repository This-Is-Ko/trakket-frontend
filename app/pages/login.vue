<template>
  <div class="flex flex-col justify-center items-center bg-gray-100 px-4"
       :style="{ minHeight: 'calc(100vh - 64px)' }">
    <h2 class="text-3xl font-bold mb-6 text-center">Login</h2>

    <form @submit.prevent="onLogin" class="w-full max-w-sm flex flex-col gap-4">
      <InputText
          v-model="email"
          placeholder="Email"
          class="w-full"
          :class="{'!border-red-500': showErrors && (!email)}"
      />
      <Password
          v-model="password"
          placeholder="Password"
          toggleMask
          :feedback="false"
          class="w-full"
          :inputClass="['w-full', showErrors && !password ? '!border-red-500 focus:!ring-red-500 focus:!border-red-500' : '']"      />

      <Button
          type="submit"
          label="Login"
          class="w-full"
          :loading="loading"
      />
    </form>

    <p class="mt-4 text-sm text-center text-gray-500">
      Don’t have an account?
      <NuxtLink to="/signup" class="text-blue-500 underline">Sign up</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';
import {useUserStore} from "~/stores/useUserStore";

const route = useRoute();
const toast = useToast();
const email = ref("");
const password = ref("");
const loading = ref(false);
const showErrors = ref(false);

const router = useRouter();

onMounted(async () => {
  const userStore = useUserStore()
  // await userStore.checkAuth();
  if (userStore.isLoggedIn) {
    await router.push("/");
  }

  if (route.query.redirectMessage) {
    toast.add({
      severity: "warn",
      summary: "Authentication Required",
      detail: "Login to access this page",
      life: 6000
    });
  }
});

function showError(message: string) {
  toast.add({ severity: "error", summary: "Error", detail: message, life: 4000 });
}

async function onLogin() {
  showErrors.value = true;

  if (!email.value || !password.value) {
    showError("Both email and password are required.");
    return;
  }

  loading.value = true;
  try {
    const userStore = useUserStore()
    await userStore.login(email.value, password.value);
    // Show success toast and navigate to home page
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "You have logged in successfully.",
      life: 4000
    });
    await router.push("/");
  } catch (err) {
    showError("Login failed. Please check your credentials.");
  } finally {
    loading.value = false;
  }
}

definePageMeta({
  public: true,
  title: 'Login'
})

useSeoMeta({
  title: "Login to Trakket",
  description: "Access your Trakket account to track your sports viewing history and explore insights into your habits.",
  ogTitle: "Login to Trakket",
  ogDescription: "Log in to your Trakket account and continue tracking the sports you watch.",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com/login"
})
</script>
