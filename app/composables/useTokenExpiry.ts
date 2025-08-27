import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";


export function useTokenExpiry() {
    const showTokenExpiredDialog = ref(false);
    const { logout } = useAuth();

    function redirectToLogin() {
        logout();
        window.location.href = "/login";
    }

    function checkTokenExpiry() {
        const expiresAtStr = localStorage.getItem("auth_expiresAt");
        if (!expiresAtStr) return;

        const expiryTime = parseInt(expiresAtStr, 10);
        const now = Date.now();
        const timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
            showTokenExpiredDialog.value = true;
        } else {
            setTimeout(() => {
                showTokenExpiredDialog.value = true;
            }, timeLeft);
        }
    }

    onMounted(() => {
        checkTokenExpiry();
    });

    return { showTokenExpiredDialog, redirectToLogin };
}
