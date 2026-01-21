import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const storedUser = await SecureStore.getItemAsync('user');

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading stored user:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (userData, token) => {
        try {
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error saving auth data:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log('Logout API error:', error);
        } finally {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = async (userData) => {
        try {
            await SecureStore.setItemAsync('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                signIn,
                signOut,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
