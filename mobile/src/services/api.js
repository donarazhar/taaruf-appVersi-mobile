import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Ganti IP dengan IP address komputer Anda (ipconfig)
// Untuk Android Emulator default: 10.0.2.2
// Untuk device asli via LAN: 192.168.x.x
export const API_URL = 'http://10.0.2.2:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
});

// Interceptor untuk menyisipkan token
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor untuk handle response error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Opsi: Logout otomatis atau refresh token
            SecureStore.deleteItemAsync('userToken');
        }
        return Promise.reject(error);
    }
);

export default api;
