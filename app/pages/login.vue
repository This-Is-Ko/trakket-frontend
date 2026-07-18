<template>
  <div class="relative flex flex-col justify-center items-center px-4 text-gray-100"
       :style="{ minHeight: 'calc(100vh - 64px)' }">
    <!-- Subtle background glow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style="background: radial-gradient(circle, var(--p-button-primary-background), transparent 70%)"
      ></div>
    </div>

    <div class="relative z-10 w-full max-w-sm">
      <h2 class="text-3xl font-extrabold tracking-tight text-center mb-8 text-white flex items-center justify-center gap-2">
          Login to Trakket
        </h2>

      <div ref="googleButtonRef" class="mb-4 flex justify-center min-h-[48px]"></div>

      <div class="flex items-center w-full my-4">
        <div class="flex-1 border-t border-white/10"></div>
        <span class="px-3 text-sm text-gray-500">or</span>
        <div class="flex-1 border-t border-white/10"></div>
      </div>

      <form @submit.prevent="onLogin" class="w-full flex flex-col gap-4">
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
            :inputClass="['w-full', showErrors && !password ? '!border-red-500 focus:!ring-red-500 focus:!border-red-500' : '']"
        />

        <Button
            type="submit"
            label="Login"
            class="w-full !font-semibold"
            :loading="loading"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from 'primevue/usetoast';
import { useUserStore } from "~/stores/useUserStore";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

// Redirect logged-in users to /favourites
if (userStore.isLoggedIn) {
  await navigateTo('/favourites', { redirectCode: 302 });
}
const email = ref("");
const password = ref("");
const loading = ref(false);
const showErrors = ref(false);
const googleButtonRef = ref<HTMLElement | null>(null);

const config = useRuntimeConfig();
const googleClientId = config.public.googleClientId as string;

function loadGisScript(): Promise<void> {
  return new Promise((resolve) => {
    const scriptId = 'google-gis-script';
    if (document.getElementById(scriptId)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function renderGoogleButton() {
  const container = googleButtonRef.value;
  if (!container || !window.google?.accounts?.id) return;

  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response: any) => handleGoogleLogin(response.credential),
  });

  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'rectangular',
    logo_alignment: 'left',
  });
}

onMounted(async () => {
  if (route.query.redirectMessage) {
    toast.add({
      severity: "warn",
      summary: "Authentication Required",
      detail: "Login to access this page",
      life: 6000,
    });
  }

  await loadGisScript();
  await nextTick();
  renderGoogleButton();
});

async function handleGoogleLogin(idToken: string) {
  loading.value = true;
  try {
    const userStore = useUserStore();
    await userStore.googleLogin(idToken);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "You have logged in successfully.",
      life: 4000,
    });
    await router.push("/favourites");
  } catch (err: any) {
    showError(err.message || "Google login failed. Please try again.");
  } finally {
    loading.value = false;
  }
}

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
    const userStore = useUserStore();
    await userStore.login(email.value, password.value);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "You have logged in successfully.",
      life: 4000,
    });
    await router.push("/favourites");
  } catch (err) {
    showError("Login failed. Please check your credentials.");
  } finally {
    loading.value = false;
  }
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

definePageMeta({
  public: true,
  title: 'Login',
});

useSeoMeta({
  title: "Login to Trakket",
  description: "Access your Trakket account to track your sports viewing history and explore insights into your habits.",
  ogTitle: "Login to Trakket",
  ogDescription: "Log in to your Trakket account and continue tracking the sports you watch.",
  ogImage: "/favicon-32x32.png",
  ogUrl: "https://www.trakket.com/login",
});
</script>
