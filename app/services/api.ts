import axios from "axios";
import {useUserStore} from "~/stores/useUserStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


api.interceptors.response.use(
    response => response,
    async error => {

        if (error.response) {
            const status = error.response.status;
            const code = error.response.data?.error;
            const message = error.response.data?.message;

            if (message) {
                alert(message);
            } else if (status === 401) {
                const userStore = useUserStore()
                await userStore.logout();
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
