import React, { useState, useEffect } from 'react';
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import packageInfo from '../package.json';
import DiscordLogin from './components/DiscordLogin';
import DiscordCallback from './components/DiscordCallback';
import { AuthProvider, useAuth } from './context/AuthContext';

const CustomRouter = ({ children }) => {
    // More reliable check for Electron environment
    const isElectron = window?.process?.type === 'renderer' ||
        navigator.userAgent.indexOf('Electron') >= 0 ||
        window.electronAPI !== undefined;

    // Use HashRouter for Electron, BrowserRouter for web
    const RouterComponent = isElectron ? HashRouter : BrowserRouter;

    console.log('Using router:', isElectron ? 'HashRouter' : 'BrowserRouter');

    return <RouterComponent>{children}</RouterComponent>;
};

function MainContent() {
    const [count, setCount] = useState(0);
    const [updateMessage, setUpdateMessage] = useState("No update status yet.");
    const { user, logout } = useAuth();
    const appVersion = packageInfo.version;

    useEffect(() => {
        // Listen for update messages from the main process
        if (window.electronAPI && typeof window.electronAPI.onUpdateMessage === 'function') {
            window.electronAPI.onUpdateMessage((message) => {
                setUpdateMessage(message);
            });
        } else {
            setUpdateMessage("Electron API not available (might be running in browser dev mode).");
        }
    }, []);

    return (
        <div
            className="container mx-auto items-center justify-center min-h-screen p-4 font-montserrat rounded-lg shadow-lg">
            <h1 className="text-4xl text-center font-bold text-orange mb-6 drop-shadow-md">
                TOGA MOTORSPORT APP
                <div className="text-center mb-4">
                    <span className="text-sm text-orange bg-gray-700 px-3 py-1 rounded-full">
                        v{appVersion}
                    </span>
                </div>
            </h1>

            {user ? (
                <div className="bg-white mx-auto p-4 rounded-xl shadow-xl border border-gray-200 mb-8 w-full max-w-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {user.avatar && (
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                            )}
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white mx-auto p-6 rounded-xl shadow-xl border border-gray-200 mb-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                        Login Required
                    </h2>
                    <DiscordLogin />
                </div>
            )}

            {user && (
                <div className="bg-white mx-auto p-8 rounded-xl shadow-xl border border-gray-200 mb-8 w-full max-w-md">
                    <p className="text-xl text-gray-800 mb-4 text-center">
                        Count: <span className="font-semibold text-indigo-600">{count}</span>
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200 transform hover:scale-105"
                            onClick={() => setCount((prevCount) => prevCount + 1)}
                        >
                            Increment
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white mx-auto p-6 rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Auto-Updater Status:
                </h2>
                <p className="text-gray-600 text-center break-words">
                    {updateMessage}
                </p>
            </div>

            <p className="mt-8 text-white text-center text-sm">
                Built with love do you!.
            </p>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <CustomRouter>
                <Routes>
                    <Route path="/auth/discord" element={<DiscordCallback />} />
                    <Route path="/" element={<MainContent />} />
                </Routes>
            </CustomRouter>
        </AuthProvider>
    );
}

export default App;
