import axios from "axios";
import { getAuthToken } from "~/composables/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor to inject auth token
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const { logout } = useAuth();

        if (error.response) {
            const status = error.response.status;
            const code = error.response.data?.error;
            const message = error.response.data?.message;

            if (message) {
                alert(message);
            } else if (status === 401) {
                logout();
                alert('Your session has expired. Please log in again.');
                window.location.href = '/login';
            } else if (status === 403) {
                alert('You do not have permission to perform this action.');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
