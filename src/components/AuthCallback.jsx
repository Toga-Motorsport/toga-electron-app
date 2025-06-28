import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (code) {
            // TODO: Exchange code for token here (API call)
            // After processing, redirect to dashboard or home
            navigate('/dashboard'); // or navigate('/') or wherever you want
        } else {
            // If no code, redirect to home
            navigate('/');
        }
    }, [navigate, location.search]);

    return <div>Processing authentication...</div>;
}

export default AuthCallback;