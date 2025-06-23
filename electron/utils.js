/**
 * Utility functions for the Electron app
 */

/**
 * Determines whether the application is running in development mode
 * @returns {boolean} True if running in development mode
 */
function isDevelopment() {
    return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV || process.env.DEBUG;
}

/**
 * Determines whether the application is running in production mode
 * @returns {boolean} True if running in production mode
 */
function isProduction() {
    return process.env.NODE_ENV === 'production';
}

/**
 * Checks if the app is running in an Electron environment
 * @returns {boolean} True if running in Electron
 */
function isElectron() {
    return process.type === 'renderer' || process.type === 'browser';
}

/**
 * Gets the appropriate base URL for API requests based on environment
 * @returns {string} The base URL for API requests
 */
function getApiBaseUrl() {
    if (isDevelopment()) {
        return process.env.API_URL || 'http://togamotorsport.local/api';
    }
    return 'https://togamotorsport.com/api';
}

module.exports = {
    isDevelopment,
    isProduction,
    isElectron,
    getApiBaseUrl
};
