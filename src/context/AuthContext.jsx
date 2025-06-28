// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Initializing authentication...');
            
            // Check localStorage for user on app load
            const storedUser = localStorage.getItem('user');
            const sanctumToken = localStorage.getItem('sanctum_token');
            const accessToken = localStorage.getItem('access_token');
            
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    console.log('User loaded from localStorage:', userData);
                    
                    // If we have a token, verify it's still valid
                    if (sanctumToken || accessToken) {
                        try {
                            console.log('Verifying stored authentication token...');
                            const response = await api.auth.me();
                            if (response.user || response.data) {
                                const currentUser = response.user || response.data;
                                setUser(currentUser);
                                localStorage.setItem('user', JSON.stringify(currentUser));
                                console.log('Token verified, user updated:', currentUser);
                            }
                        } catch (error) {
                            console.warn('Token verification failed:', error);
                            // Token is invalid, clear auth data
                            clearAuth();
                        }
                    }
                } catch (e) {
                    console.error('Error parsing stored user data', e);
                    clearAuth();
                }
            } else if (sanctumToken || accessToken) {
                // We have a token but no user data, try to fetch user
                try {
                    console.log('Attempting to fetch user with stored token...');
                    const response = await api.auth.me();
                    if (response.user || response.data) {
                        const userData = response.user || response.data;
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('User fetched with token:', userData);
                    }
                } catch (error) {
                    console.warn('Failed to fetch user with token:', error);
                    clearAuth();
                }
            }
            
            setLoading(false);
        };
        
        initializeAuth();
    }, []);

    const clearAuth = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('sanctum_token');
        localStorage.removeItem('access_token');
        setUser(null);
        console.log('Authentication cleared');
    };

    const login = (userData, token = null) => {
        console.log('Logging in user:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('sanctum_token', token);
            console.log('Token stored with login');
        }
        setUser(userData);
    };

    const logout = async () => {
        try {
            console.log('Attempting server logout...');
            // Try to logout on the server
            await api.auth.logout();
            console.log('Server logout successful');
        } catch (error) {
            console.warn('Server logout failed:', error);
            // Continue with local logout even if server logout fails
        } finally {
            clearAuth();
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
