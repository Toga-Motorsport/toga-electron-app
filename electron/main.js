const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater'); // Import autoUpdater

// Configure logging for auto-updater (optional but recommended)
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Load the preload script
            nodeIntegration: false, // It's safer to keep this false and use contextBridge
            contextIsolation: true, // Enable context isolation for security
        },
    });

    // Load the React app (Vite dev server in dev, bundled HTML in production)
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000'); // Vite dev server URL
        mainWindow.webContents.openDevTools(); // Open DevTools in development
    } else {
        // In production, load the built HTML file
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Handle window close event
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App lifecycle events
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // --- Auto-updater setup ---
    autoUpdater.checkForUpdatesAndNotify(); // Check for updates on app start

    // Listen for update events and send messages to renderer
    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send('update_message', 'Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        mainWindow.webContents.send('update_message', `Update available: ${info.version}. Downloading...`);
    });

    autoUpdater.on('update-not-available', (info) => {
        mainWindow.webContents.send('update_message', 'No new updates available.');
    });

    autoUpdater.on('error', (err) => {
        mainWindow.webContents.send('update_message', `Error in auto-updater: ${err.message}`);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        const msg = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
        mainWindow.webContents.send('update_message', msg);
    });

    autoUpdater.on('update-downloaded', (info) => {
        mainWindow.webContents.send('update_message', 'Update downloaded. App will restart to install.');
        // Optional: Ask user before quitting and installing
        setTimeout(() => {
            autoUpdater.quitAndInstall(); // Install update and restart the app
        }, 5000); // Give user 5 seconds to see the message
    });
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
