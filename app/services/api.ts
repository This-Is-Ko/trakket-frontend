import axios from "axios";
import { useUserStore } from "~/stores/useUserStore";

export const createApi = () => {
    const config = useRuntimeConfig(); // now safe, called inside a function
    const api = axios.create({
        baseURL: config.public.apiBaseUrl as string,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response) {
                const status = error.response.status;
                if (status === 401) {
                    const userStore = useUserStore();
                    await userStore.logout();
                } else if (status === 403) {
                    console.error("Permission denied (403)");
                }
            }
            return Promise.reject(error);
        }
    );

    return api;
};
