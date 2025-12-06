import axios from "axios";

if (typeof window !== "undefined") {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error && error.response) {
                (window as any).lastAxiosErrorResponse = error.response;
            }
            return Promise.reject(error);
        }
    );
}