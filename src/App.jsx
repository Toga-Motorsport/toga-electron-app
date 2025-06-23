import React, {useState, useEffect} from 'react';
import {HashRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
import packageInfo from '../package.json';
import DiscordLogin from './components/DiscordLogin';
import DiscordCallback from './components/DiscordCallback';
import {AuthProvider, useAuth} from './context/AuthContext';

// More reliable detection for Electron environment
const isElectronEnvironment = () => {
    return window?.process?.type === 'renderer' ||
        navigator.userAgent.indexOf('Electron') >= 0 ||
        window.electronAPI !== undefined;
};

const CustomRouter = ({children}) => {
    const isElectron = isElectronEnvironment();
    const RouterComponent = isElectron ? HashRouter : BrowserRouter;

    return <RouterComponent>{children}</RouterComponent>;
};

function UserProfile({user, logout}) {
    return (
        <div className="bg-gray-900 mx-auto p-4 rounded-xl shadow-xl border border-gray-600 mb-8 w-full max-w-6xl">
            <div className="grid grid-cols-4 items-center">
                {/* Left column: User avatar and name */}
                <div className="flex items-center col-span-1">
                    {user.avatar && (
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                    )}
                    <div className="flex flex-col">
                        <p className="text-base font-semibold text-orange shadow-white drop-shadow-md truncate">{user.name}</p>
                        <p className="text-xs font-bold text-lightorange truncate">{user?.driver_licence?.licence + ' Licence' || 'No Licence Found'}</p>
                    </div>
                </div>


                <div className="rounded-lg py-2 col-span-1 md:col-span-2">
                    <div className="grid grid-cols-3 divide-x divide-gray-500 w-full">
                        <div className="flex flex-col items-center px-2 py-2">
                            <p className="text-xs pb-0.5 text-gray-400">Favorite Car</p>
                            <p className="text-md font-semibold text-lightblue text-center">{user?.fav_car || 'Not Set'}</p>
                        </div>

                        <div className="flex flex-col items-center px-2 py-2">
                            <p className="text-xs pb-0.5 text-gray-400">Total Events</p>
                            <p className="text-md font-semibold text-lightblue text-center ">{user?.total_events || 'Not Set'}</p>
                        </div>

                        <div className="flex flex-col items-center px-2 py-2">
                            <p className="text-xs pb-0.5 text-gray-400">Favorite Track</p>
                            <p className="text-md font-semibold text-lightblue text-center normal-case">{user?.fav_track || 'Not Set'}</p>
                        </div>
                    </div>
                </div>

                {/* Right column: Logout button */}
                <div className="flex justify-end">
                    <button
                        onClick={logout}
                        className="text-sm bg-white px-3 py-1 rounded font-bold uppercase text-red-600 hover:text-red-800 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

function LoginPrompt() {
    return (
        <div className="bg-gray-900 mx-auto p-6 rounded-xl shadow-xl border border-gray-600 mb-8 w-full max-w-md">
            <h2 className="text-sm uppercase font-semibold text-orange mb-4 text-center">
                Start your journey with TOGA Motorsport!
            </h2>
            <DiscordLogin/>
        </div>
    );
}

function Counter({count, setCount}) {
    return (
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
    );
}

function UpdateStatus({message}) {
    return (
        <div className="bg-white mx-auto p-6 rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Auto-Updater Status:
            </h2>
            <p className="text-gray-600 text-center break-words">
                {message}
            </p>
        </div>
    );
}

function MainContent() {
    const [count, setCount] = useState(0);
    const [updateMessage, setUpdateMessage] = useState("Checking for updates...");
    const {user, logout} = useAuth();
    const appVersion = packageInfo.version;

    useEffect(() => {
        if (window.electronAPI?.onUpdateMessage) {
            // Set up listener for update messages
            const removeListener = window.electronAPI.onUpdateMessage((message) => {
                console.log('Update message:', message);
                setUpdateMessage(message);
            });
            
            // Check for updates when component mounts
            if (window.electronAPI?.checkForUpdates) {
                window.electronAPI.checkForUpdates();
            }

            // Clean up listener when component unmounts
            return () => {
                if (removeListener) removeListener();
            };
        } else {
            setUpdateMessage("Electron API not available (might be running in browser dev mode).");
        }
    }, []);

    const handleCheckUpdate = () => {
        if (window.electronAPI?.checkForUpdates) {
            setUpdateMessage("Checking for updates...");
            window.electronAPI.checkForUpdates();
        }
    };

    return (
        <div
            className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 font-montserrat rounded-lg shadow-lg">
            <h1 className="text-4xl text-center font-bold text-orange mb-6 drop-shadow-md">
                TOGA MOTORSPORT APP
                <div className="text-center mb-4">

                </div>
            </h1>

            {user ? <UserProfile user={user} logout={logout}/> : <LoginPrompt/>}

            {/*{user && <Counter count={count} setCount={setCount}/>}*/}

            {user && (
                <div className="bg-gray-900 mx-auto p-6 rounded-xl shadow-xl border border-gray-600 mb-8 w-full max-w-md">
                    <h2 className="text-xl font-semibold text-orange mb-4">
                        Auto-Updater Status
                    </h2>
                    <p className="text-white text-center break-words mb-4">
                        {updateMessage}
                    </p>
                    <button
                        id="check-update-button"
                        onClick={handleCheckUpdate}
                        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                        Check for Updates
                    </button>
                </div>
            )}

            <p className="mt-8 text-white font-semibold text-center text-sm">
                <span className="text-sm font-bold text-orange bg-gray-700 px-2 py-1 rounded-md">
            v{appVersion}
          </span> Built with love for you!
            </p>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <CustomRouter>
                <Routes>
                    <Route path="/auth/discord" element={<DiscordCallback/>}/>
                    <Route path="/" element={<MainContent/>}/>
                </Routes>
            </CustomRouter>
        </AuthProvider>
    );
}

export default App;
