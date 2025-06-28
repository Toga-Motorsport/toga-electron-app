import React, { useState, useEffect } from 'react';

const DiscordLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUri, setRedirectUri] = useState('');

    // Use the same client ID as configured in your Discord Developer Portal
    const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

    useEffect(() => {
        // Calculate the redirect URI once when the component mounts
        // Check if we're in Electron or browser environment
        const isElectron = window?.electronAPI !== undefined;
        
        let calculatedUri;
        if (import.meta.env.VITE_REDIRECT_URI) {
            calculatedUri = import.meta.env.VITE_REDIRECT_URI;
        } else if (isElectron) {
            // For Electron, use the local domain
            calculatedUri = 'https://togamotorsport.co.uk/auth/discord/cb';
        } else {
            // For browser, use the root URL since Discord doesn't support hash fragments in redirect URIs
            calculatedUri = `${window.location.origin}/auth/discord`;
        }
        
        setRedirectUri(calculatedUri);
        console.log('Environment detected:', isElectron ? 'Electron' : 'Browser');
        console.log('Redirect URI set to:', calculatedUri);
    }, []);

    const handleLogin = () => {
        setIsLoading(true);
        
        // Use environment variables with fallbacks
        const clientId = DISCORD_CLIENT_ID || '1388623370475667698';
        const encodedRedirectUri = encodeURIComponent(redirectUri);
        console.log('Client ID:', redirectUri);
        
        const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=identify+email+guilds`;
        
        console.log('Redirecting to Discord OAuth URL:', discordAuthUrl);
        console.log('Client ID:', clientId);
        console.log('Redirect URI:', redirectUri);
        
        window.location.href = discordAuthUrl;
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleLogin}
                disabled={isLoading || !redirectUri}
                className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path fill="white" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                <span>{isLoading ? "Connecting..." : "Login with Discord"}</span>
            </button>
        </div>
    );
};

export default DiscordLogin;
