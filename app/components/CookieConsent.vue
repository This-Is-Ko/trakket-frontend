<template>
    <Transition name="slide-up">
        <div
            v-if="store.isVisible"
            class="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-gray-100 border-t border-gray-700 shadow-lg"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-3">
                <p class="text-sm flex-1 text-center sm:text-left">
                    This website uses cookies for authentication and analytics to improve your experience.
                    By continuing, you agree to our use of cookies.
                    <NuxtLink
                        to="/privacy-policy"
                        class="text-indigo-400 underline hover:text-indigo-300 whitespace-nowrap"
                    >
                        Learn more
                    </NuxtLink>
                </p>
                <Button
                    label="Got it"
                    severity="info"
                    size="small"
                    @click="handleAccept"
                    class="shrink-0"
                />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useCookieConsentStore } from "~/stores/useCookieConsentStore";

const store = useCookieConsentStore();

function handleAccept() {
    store.accept();
    store.syncToBackend();
}
</script>

<style scoped>
.slide-up-enter-active {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-up-leave-active {
    transition: transform 0.2s ease-in, opacity 0.2s ease-in;
}
.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
