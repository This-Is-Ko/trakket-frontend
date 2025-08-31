import axios from "axios";
import {useUserStore} from "~/stores/useUserStore";
import {navigateTo} from "#app";

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
            if (status === 401) {
                const userStore = useUserStore()
                await userStore.logout();
                return navigateTo({
                    path: '/login',
                    query: { redirectMessage: 'Login to access this page' }
                });
            } else if (status === 403) {
                alert('You do not have permission to perform this action.');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
