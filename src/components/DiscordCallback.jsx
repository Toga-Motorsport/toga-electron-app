import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusMessage from "./StatusMessage";

const DiscordCallback = () => {
    const [status, setStatus] = useState({ type: "loading", message: "Processing Discord login..." });
    const navigate = useNavigate();
    const location = useLocation();
    const processedRef = useRef(false);
    const { login } = useAuth();
    
    console.log('DiscordCallback mounted with location:', location);

    // Extract authorization code from URL parameters
    const extractAuthCode = () => {
        console.log('Extracting auth code from location:', location);
        
        // Check for error parameter first
        let params;
        
        // Handle hash router format (#/auth/discord?code=...)
        if (location.hash && location.hash.includes('?')) {
            const hashParams = location.hash.split('?');
            if (hashParams.length > 1) {
                params = new URLSearchParams(hashParams[1]);
            }
        }
        
        // Handle browser router format (/auth/discord?code=...)
        if (!params && location.search) {
            params = new URLSearchParams(location.search);
        }
        
        if (!params) {
            console.error('No URL parameters found');
            return null;
        }
        
        // Check for Discord errors
        const error = params.get('error');
        if (error) {
            const errorDescription = params.get('error_description') || 'Unknown error';
            throw new Error(`Discord OAuth error: ${error} - ${errorDescription}`);
        }
        
        const code = params.get('code');
        console.log('Extracted auth code:', code ? 'Found' : 'Not found');
        return code;
    };

    useEffect(() => {
        const handleDiscordCallback = async () => {
            // Prevent multiple processing
            if (processedRef.current) {
                console.log('Already processed, skipping');
                return;
            }
            processedRef.current = true;

            try {
                console.log('Starting Discord callback processing');
                setStatus({ type: "loading", message: "Verifying authorization code..." });

                // Determine environment
                const isElectron = window?.electronAPI !== undefined;
                console.log('Environment:', isElectron ? 'Electron' : 'Browser');
                
                let code;
                
                if (isElectron) {
                    // For Electron, try to get code from electronAPI
                    if (window.electronAPI.requestAuthCode) {
                        code = await window.electronAPI.requestAuthCode();
                    } else {
                        // Fallback to URL extraction
                        code = extractAuthCode();
                    }
                } else {
                    // For browser, extract from URL
                    code = extractAuthCode();
                }

                console.log('Extracted code:', code ? 'SUCCESS' : 'FAILED');
                
                if (!code) {
                    throw new Error('No authorization code received from Discord. Please try logging in again.');
                }

                setStatus({ type: "loading", message: "Authenticating with server..." });

                // Determine API URL based on environment
                const baseUrl = isElectron
                    ? 'https://togamotorsport.co.uk'
                    : window.location.origin;
                
                console.log('Base URL:', baseUrl);
                console.log('Request payload:', { code: code ? 'EXISTS' : 'MISSING' });


                // Step 2: Send Discord code to Laravel backend
                const apiUrl = `${baseUrl}/api/auth/verify-discord`;
                console.log('Making auth request to:', apiUrl);
                
                // Use the exact same redirect_uri that was used in the initial OAuth request
                const redirectUri = isElectron 
                    ? 'https://togamotorsport.co.uk/auth/discord'
                    : `${window.location.origin}/auth/discord`;
                    
                console.log('Sending redirect_uri:', redirectUri);

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ 
                        code: code,
                        redirect_uri: redirectUri
                    }),
                    credentials: 'include',
                });


                if (!response.ok) {
                    let errorMessage;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.error || errorData.errors || `Server error (${response.status})`;
                        console.error('Server error response:', errorData);
                        
                        // Handle Laravel validation errors
                        if (errorData.errors && typeof errorData.errors === 'object') {
                            const firstError = Object.values(errorData.errors)[0];
                            if (Array.isArray(firstError)) {
                                errorMessage = firstError[0];
                            }
                        }
                    } catch (e) {
                        errorMessage = `Server error (${response.status}): ${response.statusText}`;
                        console.error('Failed to parse error response:', e);
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                console.log('Response data:', data);

                // Handle different response formats from Laravel
                let userData;
                if (data.user) {
                    userData = data.user;
                } else if (data.data && data.data.user) {
                    userData = data.data.user;
                } else if (data.name || data.email) {
                    // Direct user object
                    userData = data;
                } else {
                    console.error('No user data in response:', data);
                    throw new Error('Invalid user data received from server');
                }
                
                // Store the Sanctum token if provided
                if (data.token) {
                    localStorage.setItem('sanctum_token', data.token);
                    console.log('Sanctum token stored');
                }
                
                // Store additional auth data if provided
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    console.log('Access token stored');
                }

                console.log('Login successful, user:', userData);
                login(userData, data.token);
                setStatus({ type: "success", message: "Login successful! Redirecting..." });

                setTimeout(() => {
                    console.log('Redirecting to home page');
                    navigate('/');
                }, 1500);
                
            } catch (error) {
                console.error('Discord authentication error:', error);
                setStatus({ type: "error", message: `Login failed: ${error.message}` });

                setTimeout(() => {
                    console.log('Redirecting to home page after error');
                    navigate('/');
                }, 3000);
            }
        };

        // Small delay to ensure the component is fully mounted
        const timeoutId = setTimeout(handleDiscordCallback, 100);
        
        return () => clearTimeout(timeoutId);
    }, []); // Remove dependencies to prevent re-runs

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <StatusMessage type={status.type} message={status.message} />
        </div>
    );
};

export default DiscordCallback;
