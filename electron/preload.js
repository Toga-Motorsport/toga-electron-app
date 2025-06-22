const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited set of IPC methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Example of sending a message from renderer to main
    sendMessage: (message) => ipcRenderer.send('send-message-to-main', message),

    // Example of receiving messages from main process (e.g., auto-update messages)
    onUpdateMessage: (callback) => ipcRenderer.on('update_message', (_event, value) => callback(value)),

    // You can expose other APIs as needed, for example:
    // openExternalLink: (url) => ipcRenderer.send('open-external-link', url),
});

// Example of listening for a message from the renderer (in main.js, this would be `ipcMain.on('send-message-to-main', ...)`)
ipcRenderer.on('send-message-to-main', (event, message) => {
    console.log('Message from renderer:', message);
    // Do something with the message in the preload script, or forward to main
});

