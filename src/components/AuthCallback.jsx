// In AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if there's a discord code in the URL
        const url = window.location.href;
        if (url.includes('code=')) {
            const code = new URLSearchParams(url.split('?')[1]).get('code');
            if (code) {
                // Process the code here or redirect to your discord callback handler
                navigate('/auth/discord', { state: { code } });
                return;
            }
        }
        // If no code, redirect to home
        navigate('/');
    }, [navigate, location]);

    return <div>Processing authentication...</div>;
}

export default AuthCallback;
