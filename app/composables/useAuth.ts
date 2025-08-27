import { ref, computed } from "vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const token = ref<string | null>(null);
const username = ref<string | null>(null);
const expiresAt = ref<number | null>(null);

async function signup(usernameParam: string, email: string, password: string) {
    try {
        await axios.post(`${API_BASE_URL}/api/auth/signup`, {
            username: usernameParam,
            email: email,
            password: password,
        });
    } catch (err: any) {
    const msg = err.response?.data?.message || "Signup failed. Please try again.";
    throw new Error(msg);
}
}

async function verifyOtp(email: string, otp: string) {
    try {
        await axios.post(`${API_BASE_URL}/api/auth/otp/verify`, {
            email: email,
            otp: otp,
        });
    } catch (err: any) {
        const msg = err.response?.data?.message || "OTP verification failed. Please try again.";
        throw new Error(msg);
    }
}

async function resendOtp(email: string) {
    try {
        await axios.post(`${API_BASE_URL}/api/auth/otp/resend`, {
            email: email
        });
    } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to resend OTP. Please try again.";
        throw new Error(msg);
    }
}

async function login(email: string, password: string) {
    try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password,
        });

        token.value = res.data.token ?? null;
        username.value = res.data.username ?? null;
        expiresAt.value = res.data.expiresAt ?? null;

        saveAuthToStorage();
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Login failed");
    }
}

function saveAuthToStorage() {
    localStorage.setItem("auth_token", token.value ?? "");
    localStorage.setItem("auth_username", username.value ?? "");
    localStorage.setItem("auth_expiresAt", expiresAt.value?.toString() ?? "");
}

export function getAuthToken() {
    return localStorage.getItem("auth_token");
}

function logout() {
    token.value = null;
    username.value = null;
    expiresAt.value = null;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_username");
    localStorage.removeItem("auth_expiresAt");
}

// Restore values from storage on app init
if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("auth_username");
    const storedExpiresAt = localStorage.getItem("auth_expiresAt");

    if (storedToken) token.value = storedToken;
    if (storedUsername) username.value = storedUsername;
    if (storedExpiresAt) expiresAt.value = parseInt(storedExpiresAt, 10);
}

const isLoggedIn = computed(() => {
    if (!token.value || !expiresAt.value) return false;
    return Date.now() < expiresAt.value; // still valid
});

export function useAuth() {
    return {
        token,
        username,
        expiresAt,
        isLoggedIn,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
    };
}