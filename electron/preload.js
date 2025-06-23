const { contextBridge, ipcRenderer } = require('electron');

// Debug log to verify preload is running
console.log('Preload script is running');
contextBridge.exposeInMainWorld('electronAPI', {
    requestAuthCode: () => {
        ipcRenderer.send('get-auth-code');
        return new Promise((resolve) => {
            ipcRenderer.once('discord-oauth-callback', (_, code) => {
                resolve(code);
            });
        })
    },
    
    // Add auto-update related functions
    checkForUpdates: () => {
        console.log('Renderer requesting update check');
        ipcRenderer.send('check-for-updates');
    },
    
    onUpdateMessage: (callback) => {
        // Listen for update messages from main process
        ipcRenderer.on('update-message', (_, message) => {
            console.log('Update message received:', message);
            callback(message);
        });
    },

    restartAndInstall: () => {
        console.log('Renderer requesting app restart to install update');
        ipcRenderer.send('restart-and-install');
    }
});

// Expose select APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
    // Handle Discord OAuth callback
    handleOAuthCallback: (callback) => {
        console.log('OAuth callback handler registered');

        // Listen for direct OAuth callbacks
        ipcRenderer.on('discord-oauth-callback', (event, code) => {
            console.log('IPC: Received Discord OAuth callback code');
            callback(code);
        });

        // Request any stored auth code
        console.log('Requesting stored auth code');
        ipcRenderer.send('get-auth-code');
    },

    // Open external links safely
    openExternal: (url) => {
        console.log('Opening external URL:', url);
        ipcRenderer.send('open-external', url);
    }
});

// Add a console log to indicate preload script has finished executing
console.log('Preload script finished setup');