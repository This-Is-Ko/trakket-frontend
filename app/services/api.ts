import axios from "axios";
import {useUserStore} from "~/stores/useUserStore";
import { useRouter } from 'vue-router';

const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PUBLIC_ROUTE_PREFIXES = ["/", "/about", "/login", "/signup"];

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
            } else if (status === 403) {
                alert('You do not have permission to perform this action.');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
