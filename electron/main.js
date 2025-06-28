const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('node:path');
const express = require('express');
const server = express();
const port = 3000;
// Add these imports at the top
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
log.info('App starting... Version:', app.getVersion());
// Track the main window
let mainWindow;

// Configure logging for auto-updater
// This writes logs to:
// - on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
// - on macOS: ~/Library/Logs/{app name}/{process type}.log
log.transports.file.level = 'info';
console.log = log.log;
autoUpdater.logger = log;

// Simple function to send update messages to the renderer
function sendStatusToWindow(text) {
  log.info(text);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', text);
  }
}

function setupPeriodicUpdateChecks() {
    const FOUR_HOURS = 4 * 60 * 60 * 1000;
    setInterval(() => {
        log.info('Scheduled update check...');
        autoUpdater.checkForUpdates().catch(err => {
            log.error('Scheduled check failed:', err);
        });
    }, FOUR_HOURS);
}

// Create the main application window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250,
        height: 850,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: false,
            autoHideMenuBar :false,
        },
    });

    if (process.env.NODE_ENV === 'production') {
        mainWindow.setMenu(null);
    }
    console.log('Creating main window');
    console.log(process.env.NODE_ENV);

    // Load the appropriate URL based on environment
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        //mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
        mainWindow.webContents.autoHideMenuBar = true;
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Set up auto-updater event listeners
function setupAutoUpdater() {
  // When update checking starts
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for updates...');
  });

  // When an update is available
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow(`Update available: ${app.getVersion()} → ${info.version}`);
});

  // When no update is available
  autoUpdater.on('update-not-available', (info) => {
    autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Your app is up to date.');
  });
  });

  // When update is downloading
  autoUpdater.on('download-progress', (progressObj) => {
    // Format percentage with 1 decimal point
    const percent = progressObj.percent.toFixed(1);
    
    // Calculate download speed in a readable format
    let speed = progressObj.bytesPerSecond;
    let speedUnit = 'B/s';
    
    if (speed > 1024) {
        speed /= 1024;
        speedUnit = 'KB/s';
    }
    
    if (speed > 1024) {
        speed /= 1024;
        speedUnit = 'MB/s';
    }
    
    const formattedSpeed = speed.toFixed(1) + ' ' + speedUnit;
    
    // Build a cleaner message
    let message = `Downloaded ${percent}% (${formattedSpeed})`;
    sendStatusToWindow(message);
});

  // When update is downloaded and ready to install
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded. Click "Restart & Install" to apply the update.');
    
    // Optional: Show a native dialog for maximum visibility
    if (mainWindow) {
        const dialogOpts = {
            type: 'info',
            buttons: ['Later', 'Restart Now'],
            title: 'Application Update',
            message: 'A new version has been downloaded.',
            detail: 'Restart the application to apply the update.'
        };
        
        dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
            if (returnValue.response === 1) {
                autoUpdater.quitAndInstall(true, true);
            }
        });
    }
});

  // If there's an error during update
  autoUpdater.on('error', (err) => {
    const errorMessage = `Update error: ${err.message || err.toString()}`;
    sendStatusToWindow(errorMessage);
    log.error(errorMessage);
    
    // After a timeout, suggest manual download
    setTimeout(() => {
        sendStatusToWindow('Could not update automatically. Please download the latest version from our website.');
    }, 5000);
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
    
    // Only set up auto-updater in production
    if (process.env.NODE_ENV !== 'development') {
        setupAutoUpdater();
        setupPeriodicUpdateChecks(); // Add this line to enable periodic checks
        
        // Check for updates right after app starts
        // (with a small delay to let the app load first)
        setTimeout(() => {
            sendStatusToWindow('Checking for updates after startup...');
            autoUpdater.checkForUpdates();
        }, 3000);
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Handle external URL opening
    ipcMain.on('open-external', (event, url) => {
    console.log('Main process opening external URL:', url);
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
    
    // Manual update check (can be triggered from UI)
    ipcMain.on('check-for-updates', () => {
        if (process.env.NODE_ENV !== 'development') {
            sendStatusToWindow('Manually checking for updates...');
            autoUpdater.checkForUpdates();
        } else {
            sendStatusToWindow('Updates are disabled in development mode');
        }
    });

    ipcMain.on('restart-and-install', () => {
    log.info('User triggered app restart to install update');
    sendStatusToWindow('Restarting to install update...');
    
    // Quit and install with explicit user action
    autoUpdater.quitAndInstall(true, true);
});
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});