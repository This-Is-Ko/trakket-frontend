import { useAuth } from "@/composables/useAuth";

export default defineNuxtPlugin(() => {
    const auth = useAuth();

    const storedToken = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("auth_username");
    const storedExpiresAt = localStorage.getItem("auth_expiresAt");

    if (storedToken) auth.token.value = storedToken;
    if (storedUsername) auth.username.value = storedUsername;
    if (storedExpiresAt) auth.expiresAt.value = parseInt(storedExpiresAt, 10);
});