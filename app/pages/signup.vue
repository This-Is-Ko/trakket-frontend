<template>
  <Toast ref="toast" class="max-w-xs sm:max-w-sm" position="top-center" />
  <div class="flex flex-col justify-center items-center bg-gray-100 px-4"
       :style="{ minHeight: 'calc(100vh - 64px)' }">
    <h2 class="text-3xl font-bold mb-6 text-center">Sign up</h2>

    <!-- Signup form -->
    <form v-if="!otpStep" @submit.prevent="onSignup" class="w-full max-w-sm flex flex-col gap-4">
      <InputText
          v-model="username"
          placeholder="Username"
          :class="{'!border-red-500': showErrors && !username}"
          class="w-full"
      />
      <InputText
          v-model="email"
          placeholder="Email"
          :class="{'!border-red-500': showErrors && (!email || !isValidEmail(email))}"
          class="w-full"
      />
      <Password
          v-model="password"
          placeholder="Password"
          toggleMask
          :feedback="false"
          class="w-full"
          :inputClass="['w-full', showErrors && (!password || !isStrongPassword(password)) ? '!border-red-500 focus:!ring-red-500 focus:!border-red-500' : '']"
      />

      <Button
          type="submit"
          label="Sign Up"
          class="w-full"
          :loading="loading"
      />
    </form>

    <!-- OTP verification form -->
    <div v-else class="w-full max-w-sm flex flex-col gap-4">
      <p class="text-center text-gray-700">
        We sent an OTP to <strong>{{ email }}</strong>. Enter it below to verify your account.
      </p>

      <InputText
          v-model="otp"
          placeholder="Enter OTP"
          class="w-full"
      />

      <Button
          label="Verify OTP"
          class="w-full"
          :disabled="otpVerifyButtonDisabled"
          :loading="loading"
          @click="onVerifyOtp"
      />

      <Button
          label="Resend OTP"
          class="w-full"
          outlined
          :disabled="countdown > 0"
          :loading="otpResendLoading"
          @click="onResendOtp"
      />
      <p v-if="countdown > 0" class="text-sm text-center text-gray-500">
        You can resend OTP in {{ countdown }}s
      </p>
    </div>

    <p v-if="!otpStep" class="mt-4 text-sm text-center text-gray-500">
      Already have an account?
      <NuxtLink to="/login" class="text-blue-500 underline">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useToast } from 'primevue/usetoast';
import {useUserStore} from "~/stores/useUserStore";

const toast = useToast();
const username = ref("");
const email = ref("");
const password = ref("");
const otp = ref("");
const loading = ref(false);
const otpResendLoading = ref(false);
const showErrors = ref(false);
const otpStep = ref(false);
const otpVerifyButtonDisabled = ref(false);

const countdown = ref(0);
let countdownTimer: NodeJS.Timeout | null = null;

const router = useRouter();
const { signup, verifyOtp, resendOtp } = useAuth();

onMounted(async () => {
  const userStore = useUserStore()
  if (userStore.isLoggedIn) {
    await router.push("/");
  }
});

function showMessage(message: string, type: "success" | "error" = "error") {
  toast.add({ severity: type, summary: type === "success" ? "Success" : "Error", detail: message, life: 4000 });
}

function isValidUsername(username: string) {
  const regex = /^[a-zA-Z0-9]{3,}$/;
  return regex.test(username);
}

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isStrongPassword(password: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

async function onSignup() {
  showErrors.value = true;
  if (!username.value || !email.value || !password.value) {
    showMessage("All fields are required.", "error");
    return;
  }
  if (!isValidUsername(username.value)) {
    showMessage("Username must be at least 3 characters long and use alphanumeric characters.", "error");
    return;
  }
  if (!isValidEmail(email.value)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }
  if (!isStrongPassword(password.value)) {
    showMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.", "error");
    return;
  }

  loading.value = true;
  try {
    await signup(username.value, email.value, password.value);
    showMessage("Signup successful. Please check your email for OTP.", "success");
    otpStep.value = true;
    startCountdown();
  } catch (err: any) {
    showMessage(err.message, "error");
  } finally {
    loading.value = false;
  }
}

async function onVerifyOtp() {
  if (!otp.value) {
    showMessage("Please enter the OTP.", "error");
    return;
  }

  loading.value = true;
  try {
    await verifyOtp(email.value, otp.value);
    showMessage("Signup verified successfully. Redirecting to login...", "success");
    setTimeout(() => router.push("/login"), 1500);
    otpVerifyButtonDisabled.value = true;
  } catch (err: any) {
    if (err.message == "Max attempts reached." || err.message == "Expired OTP.") {
      // Disable the verify button for these errors
      otpVerifyButtonDisabled.value = true;
    }
    showMessage(err.message, "error");
  } finally {
    loading.value = false;
  }
}

async function onResendOtp() {
  otpResendLoading.value = true;
  try {
    await resendOtp(email.value);
    showMessage("OTP resent successfully. Check your email.", "success");
    startCountdown();
    otpVerifyButtonDisabled.value = false;
  } catch (err: any) {
    showMessage(err.message, "error");
  } finally {
    otpResendLoading.value = false;
  }
}

function startCountdown() {
  countdown.value = 30;
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownTimer!);
    }
  }, 1000);
}

definePageMeta({
  public: true,
  title: 'Signup'
})
</script>
