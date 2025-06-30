import React, {useState, useEffect} from 'react';
import {HashRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
import packageInfo from '../package.json';
import DiscordLogin from './components/DiscordLogin';
import DiscordCallback from './components/DiscordCallback';
import {AuthProvider, useAuth} from './context/AuthContext';
import Cards from "./components/Cards";
import FuelCalculator from './components/FuelCalculator';
import Events from "./components/Events";
import EventSingle from "./components/EventSingle";
import DebugAuth from "./components/DebugAuth";
import ReportIncident from "./components/ReportIncident";

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

// A simple component to display update status
function UpdateStatus({ message, onCheckUpdate }) {
    const isElectron = isElectronEnvironment();
    const [updateReady, setUpdateReady] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // Parse download progress from message
    useEffect(() => {
        if (message.includes('Downloaded')) {
            // Extract percentage from message like "Downloaded 45%"
            const percentMatch = message.match(/Downloaded\s+(\d+)%/);
            if (percentMatch && percentMatch[1]) {
                setDownloadProgress(parseInt(percentMatch[1]));
            }
        }

        if (message.includes('Update downloaded')) {
            setUpdateReady(true);
            setDownloadProgress(100);
        }
    }, [message]);

    // Don't render if not in Electron or if message is empty
    if (!isElectron || message === '') return null;

    // Handle restart to install update
    const handleRestart = () => {
        if (window.electronAPI) {
            window.electronAPI.restartAndInstall();
        }
    };

    // Determine if currently downloading
    const isDownloading = message.includes('Download') && !message.includes('downloaded');

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 text-sm max-w-xs">
            <p className="text-gray-300 text-xs mb-2 font-medium">{message}</p>

            {isDownloading && (
                <div className="mb-2">
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${downloadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <button
                    onClick={onCheckUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded-md transition-colors"
                    disabled={isDownloading}
                >
                    Check for Updates
                </button>

                {updateReady && (
                    <button
                        onClick={handleRestart}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 ml-2 rounded-md transition-colors"
                    >
                        Restart & Install
                    </button>
                )}
            </div>
        </div>
    );
}

function UserProfile({user, logout}) {
    return (
        <div className="bg-gray-900 mx-auto p-4 rounded-xl shadow-xl border border-gray-600 mb-1 w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center">
                {/* Left column: User avatar and name */}
                <div className="flex items-center col-span-1 md:col-span-1 mx-auto md:mx-0">
                    {user.avatar && (
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full mr-2 hidden md:block"
                        />
                    )}
                    <div className="flex flex-col mx-auto md:mx-0">
                        <p className="text-base font-semibold text-orange shadow-white drop-shadow-md truncate">{user.name}</p>
                        <p className="text-xs font-bold text-lightorange truncate text-center md:text-left">{user?.driver_licence?.licence + ' Licence' || 'No Licence Found'}</p>
                    </div>
                </div>


                <div className="rounded-lg py-2 col-span-2 md:col-span-2">
                    <div className="grid grid-cols-1 xs:grid-cols-3 md:grid-cols-3 md:divide-x md:divide-gray-500 w-full">
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
                            <p className="text-md font-semibold text-lightblue text-center capitalize">{user?.fav_track || 'Not Set'}</p>
                        </div>
                    </div>
                </div>

                {/* Right column: Logout button */}
                <div className="flex justify-end mx-auto md:mx-0">
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
        <div className="bg-gray-900 mx-auto p-6 rounded-xl shadow-xl border border-gray-600 mb-3 w-full max-w-md">
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


function MainContent() {
    const [count, setCount] = useState(0);
    const [updateMessage, setUpdateMessage] = useState("Waiting for update status...");
    const {user, logout} = useAuth();
    const appVersion = packageInfo.version;
    const isElectron = isElectronEnvironment();

    // Listen for update messages
    useEffect(() => {
        if (isElectron && window.electronAPI) {
            // Set up listener for update messages from main process
            window.electronAPI.onUpdateMessage((message) => {
                console.log('Update message in React:', message);
                setUpdateMessage(message);
            });
        }
    }, [isElectron]);

    // Function to check for updates
    const handleCheckUpdate = () => {
        if (isElectron && window.electronAPI) {
            window.electronAPI.checkForUpdates();
            setUpdateMessage('Checking for updates...');
        }
    };

    return (
        <div
            className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 font-montserrat rounded-lg shadow-lg">
            <h1 className="text-4xl text-center font-bold text-orange mb-6 drop-shadow-md">
                TOGA MOTORSPORT APP
            </h1>

            {user ? <UserProfile user={user} logout={logout}/> : <LoginPrompt/>}
            {user ? <Cards user={user}/> : null}
            

            <p className="mt-2 mb-2 text-white font-semibold text-center text-sm">
                 Built with love for you!
            </p>
            <p><span className="text-sm font-bold text-orange bg-gray-700 px-2 py-1 rounded-md">
            v{appVersion}
          </span></p>

            {/* Add the update status component */}
            {isElectron && <UpdateStatus
                message={updateMessage}
                onCheckUpdate={handleCheckUpdate}
            />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <CustomRouter>
                <Routes>
                    <Route path="/auth/discord" element={<DiscordCallback/>}/>
                    <Route path="/debug-auth" element={<DebugAuth/>}/>
                    <Route path="/" element={<MainContent/>}/>
                    <Route path="/fuel-calculator" element={<FuelCalculator/>}/>
                    <Route path="/report-incident" element={<ReportIncident/>}/>
                    <Route path="/my-events" element={<Events/>}/>
                    <Route path="/event/:id" element={<EventSingle/>}/>
                </Routes>
            </CustomRouter>
        </AuthProvider>
    );
}

export default App;
