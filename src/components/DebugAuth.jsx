import React from 'react';
import { useLocation } from 'react-router-dom';

const DebugAuth = () => {
    const location = useLocation();
    
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Discord Auth Debug</h1>
            
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">Location Object:</h2>
                <pre className="bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(location, null, 2)}
                </pre>
            </div>
            
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">Current URL:</h2>
                <p className="font-mono break-all">{window.location.href}</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">URL Search Params:</h2>
                <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(Object.fromEntries(new URLSearchParams(location.search)), null, 2)}
                </pre>
            </div>
            
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">URL Hash:</h2>
                <p className="font-mono break-all">{location.hash}</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
                <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify({
                        VITE_DISCORD_CLIENT_ID: import.meta.env.VITE_DISCORD_CLIENT_ID,
                        VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
                        isElectron: window?.electronAPI !== undefined
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default DebugAuth;
