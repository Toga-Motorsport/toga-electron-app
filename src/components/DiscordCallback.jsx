import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusMessage from "./StatusMessage";

const DiscordCallback = () => {
    const [status, setStatus] = useState({ type: "loading", message: "Processing Discord login..." });
    const navigate = useNavigate();
    const location = useLocation();
    const requestSent = useRef(false);
    const { login } = useAuth();

    // Extract authorization code from URL parameters
    const extractAuthCode = () => {
        // Handle hash router format
        const hashParams = location.hash.split('?');
        if (hashParams.length > 1) {
            return new URLSearchParams(hashParams[1]).get('code');
        }
        // Handle browser router format
        return new URLSearchParams(location.search).get('code');
    };

    useEffect(() => {
        const handleDiscordCallback = async () => {
            if (requestSent.current) return;
            requestSent.current = true;

            try {
                setStatus({ type: "loading", message: "Verifying authorization code..." });

                // Determine environment and get auth code
                const isElectron = window?.electronAPI !== undefined;
                let code = isElectron
                    ? await window.electronAPI.requestAuthCode()
                    : extractAuthCode();

                if (!code) {
                    throw new Error('No authorization code received from Discord');
                }

                setStatus({ type: "loading", message: "Authenticating with server..." });

                // Determine API URL based on environment
                const apiUrl = isElectron
                    ? 'http://togamotorsport.local/api/auth/verify-discord'
                    : '/api/auth/verify-discord';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Server error (${response.status})`);
                }

                const data = await response.json();
                console.log('Discord authentication response:', data);

                if (!data.user) {
                    throw new Error('Invalid user data received');
                }

                login(data.user);
                setStatus({ type: "success", message: "Login successful! Redirecting..." });

                setTimeout(() => navigate('/'), 1500);
            } catch (error) {
                console.error('Discord authentication error:', error);
                setStatus({ type: "error", message: `Login failed: ${error.message}` });

                setTimeout(() => navigate('/'), 2000);
            }
        };

        handleDiscordCallback();
    }, [navigate, location, login]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <StatusMessage type={status.type} message={status.message} />
        </div>
    );
};

export default DiscordCallback;
