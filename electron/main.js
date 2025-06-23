const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const express = require('express');
const server = express();
const port = 3000
const { autoUpdater } = require('electron-updater');;

// if (!process.env.NODE_ENV) {
//   process.env.NODE_ENV = app.isPackaged ? 'production' : 'development';
// }

// Track the main window
let mainWindow;

function setupAutoUpdater() {
    // Log update events
    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';

    // Check for updates immediately when app starts
    autoUpdater.checkForUpdatesAndNotify();

    // Set up auto updater events
    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('Update available. Downloading...');
    });

    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('Application is up to date.');
    });

    autoUpdater.on('error', (err) => {
        sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        sendStatusToWindow(
            `Download speed: ${progressObj.bytesPerSecond} - ` +
            `Downloaded ${progressObj.percent}% ` +
            `(${progressObj.transferred} / ${progressObj.total})`
        );
    });

    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('Update downloaded. Will install on restart.');
        // If you want to install immediately:
        // autoUpdater.quitAndInstall();
    });

    // Check for updates periodically (e.g., every 2 hours)
    setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify();
    }, 2 * 60 * 60 * 1000);
}

function sendStatusToWindow(text) {
  console.log(text);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', text);
  }
}
console.log(process.env.NODE_ENV);
// Create the main application window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: process.env.NODE_ENV === 'development'
        },

        autoHideMenuBar: process.env.NODE_ENV === 'production',
    });

    if (process.env.NODE_ENV === 'production') {
        mainWindow.setMenu(null);
    }

    // Load the appropriate URL based on environment
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
        //mainWindow.webContents.closeDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Set up the Express server to handle Discord OAuth callback
server.get('/auth/discord', (req, res) => {
    const code = req.query.code;
    console.log('Received Discord auth code:', code);

    // Save the code globally
    global.discordAuthCode = code;

    // Send code to renderer if window exists
    if (mainWindow && code) {
        console.log('Sending code to renderer process');

        // First load the auth callback page
        const callbackUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/auth/discord'
            : `file://${path.join(__dirname, '../dist/index.html')}#/auth/discord`;

        mainWindow.loadURL(callbackUrl);

        // Wait for page to load before sending the code
        mainWindow.webContents.once('did-finish-load', () => {
            console.log('Page loaded, now sending auth code');
            mainWindow.webContents.send('discord-oauth-callback', code);
        });
    }

    // Show success page to user
    res.send(`
        <html><body>
            <h1>Authentication Successful!</h1>
            <p>You can close this window and return to the app.</p>
            <script>setTimeout(() => window.close(), 3000);</script>
        </body></html>
    `);
});

// Start the Express server
server.listen(port, () => {
    console.log(`Local OAuth server listening at http://localhost:${port}`);
});

// App lifecycle events
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    if (process.env.NODE_ENV === 'production') {
        setupAutoUpdater();
    }

    // Handle external URL opening
    ipcMain.on('open-external', (event, url) => {
        shell.openExternal(url);
    });

    // Handle requests for stored auth code
    ipcMain.on('get-auth-code', (event) => {
        if (global.discordAuthCode) {
            console.log('Sending stored auth code to renderer');
            event.sender.send('discord-oauth-callback', global.discordAuthCode);
        } else {
            console.log('No stored auth code found');
        }
    });

    ipcMain.on('check-for-updates', () => {
        if (process.env.NODE_ENV === 'production') {
            autoUpdater.checkForUpdatesAndNotify();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
