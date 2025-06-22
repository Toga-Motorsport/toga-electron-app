import React, { useState, useEffect } from 'react';

function App() {
    const [count, setCount] = useState(0);
    const [updateMessage, setUpdateMessage] = useState("No update status yet.");

    useEffect(() => {
        // Listen for update messages from the main process
        // `electronAPI` is exposed via the preload script
        if (window.electronAPI && typeof window.electronAPI.onUpdateMessage === 'function') {
            window.electronAPI.onUpdateMessage((message) => {
                setUpdateMessage(message);
            });
        } else {
            setUpdateMessage("Electron API not available (might be running in browser dev mode).");
        }
    }, []);

    const handleSendMessage = () => {
        if (window.electronAPI && typeof window.electronAPI.sendMessage === 'function') {
            window.electronAPI.sendMessage(`Hello from React! Current count: ${count}`);
        } else {
            console.log("Electron API not available to send message.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-indigo-700 mb-6 drop-shadow-md">
                My React Electron App
            </h1>

            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 mb-8 w-full max-w-md">
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
                    <button
                        className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-200 transform hover:scale-105"
                        onClick={handleSendMessage}
                    >
                        Send Message to Main
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Auto-Updater Status:
                </h2>
                <p className="text-gray-600 text-center break-words">
                    {updateMessage}
                </p>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
                Built with React, Electron, and Tailwind CSS.
            </p>
        </div>
    );
}

export default App;
