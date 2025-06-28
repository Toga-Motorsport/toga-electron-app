import React, { useEffect } from 'react';

const DiscordRedirect = () => {
    useEffect(() => {
        console.log('DiscordRedirect component mounted');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        
        // Get the current search parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        console.log('Code:', code);
        console.log('Error:', error);
        
        if (code || error) {
            // Redirect to the callback route with the parameters
            const callbackUrl = `${window.location.origin}/#/auth/discord/callback${window.location.search}`;
            console.log('Redirecting to callback:', callbackUrl);
            window.location.href = callbackUrl;
        } else {
            // No parameters, redirect to home
            console.log('No auth parameters found, redirecting to home');
            window.location.href = `${window.location.origin}/#/`;
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange mx-auto mb-4"></div>
                <p className="text-white">Processing Discord authentication...</p>
            </div>
        </div>
    );
};

export default DiscordRedirect;
