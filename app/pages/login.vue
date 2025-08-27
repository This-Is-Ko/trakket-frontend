<template>
  <Toast ref="toast" />
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
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
import { useAuth } from "~/composables/useAuth";

const toast = useToast();
const email = ref("");
const password = ref("");
const loading = ref(false);
const showErrors = ref(false);

const router = useRouter();
const { login, isLoggedIn } = useAuth();


onMounted(() => {
  if (isLoggedIn.value) {
    router.push("/");
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
    await login(email.value, password.value);
    // On success, navigate to home page
    router.push("/");
  } catch (err) {
    showError("Login failed. Please check your credentials.");
  } finally {
    loading.value = false;
  }
}
</script>
