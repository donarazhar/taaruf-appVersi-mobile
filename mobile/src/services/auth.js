import api from './api';
import * as SecureStore from 'expo-secure-store';

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });

        if (response.data.token) {
            await SecureStore.setItemAsync('userToken', response.data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout error', error);
    } finally {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('user');
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};
