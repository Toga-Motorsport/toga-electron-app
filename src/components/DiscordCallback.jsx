// src/components/DiscordCallback.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusMessage from "./StatusMessage";
const DiscordCallback = () => {
    const [status, setStatus] = useState('Processing Discord login...');
    const navigate = useNavigate();
    const location = useLocation();
    const requestSent = useRef(false); // Add this ref to track if request was sent
    const { login } = useAuth();


    useEffect(() => {
        // Log the complete URL and all available parameters
        const handleDiscordCallback = async () => {
            // Don't proceed if we've already made the request
            if (requestSent.current) return;
            requestSent.current = true;

            try {
                let code;
                const hashParams = location.hash.split('?');
                if (hashParams.length > 1) {
                    code = new URLSearchParams(hashParams[1]).get('code');
                } else {
                    // Fallback to traditional search params if not found in hash
                    code = new URLSearchParams(location.search).get('code');
                }
                const isElectron = !!window.electronAPI;
                if (isElectron) {
                    code = await window.electronAPI.requestAuthCode();
                    console.log('Retrieved code from Electron:', code);
                }


                if (!code) {
                    throw new Error('No authorization code received from Discord');
                }


                const apiUrl = isElectron
                    ? 'http://togamotorsport.local/api/auth/verify-discord' // Electron-specific endpoint
                    : '/api/auth/verify-discord';
                // Send the code to your backend
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                    credentials: 'include', // Include cookies if needed
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to authenticate with server');
                }

                const data = await response.json();
                // Store user data in localStorage
                if (data.user) {
                    login(data.user);
                } else {
                    console.warn('No user data received from backend');
                }
                setStatus(<StatusMessage type="success" message="Login successful! Redirecting..."/>);
                setTimeout(() => navigate('/'), 2000); // Redirect after 1 second
            } catch (error) {
                setStatus(<StatusMessage type="error" message={`Login failed: ${error.message}`} />);
                setTimeout(() => navigate('/'), 2000); // Redirect after 1 second
            }
        };

        handleDiscordCallback();
    }, [navigate, location]);
    return (
        <div className="discord-callback-container">
            {status}
        </div>
    );
    // Rest of component code
};

export default DiscordCallback;
