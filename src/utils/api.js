// API utility for making requests to Laravel backend with Sanctum authentication

const isElectron = () => window?.electronAPI !== undefined;

const getBaseUrl = () => {
    return isElectron() 
        ? 'https://togamotorsport.co.uk' 
        : window.location.origin;
};

const getAuthHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    };

    // Add Sanctum token if available
    const sanctumToken = localStorage.getItem('sanctum_token');
    if (sanctumToken) {
        headers['Authorization'] = `Bearer ${sanctumToken}`;
    }

    // Add access token if available (fallback)
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && !sanctumToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
};

// Initialize CSRF protection for Sanctum
export const initCSRF = async () => {
    try {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log('CSRF protection initialized');
    } catch (error) {
        console.warn('CSRF initialization failed:', error);
    }
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    const config = {
        headers: getAuthHeaders(),
        credentials: 'include',
        ...options
    };

    // Merge headers if provided in options
    if (options.headers) {
        config.headers = { ...config.headers, ...options.headers };
    }

    console.log(`Making API request to: ${url}`);
    console.log('Request config:', config);

    try {
        const response = await fetch(url, config);
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
                
                // Handle Laravel validation errors
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const firstError = Object.values(errorData.errors)[0];
                    if (Array.isArray(firstError)) {
                        errorMessage = firstError[0];
                    }
                }
                
                console.error('API Error Response:', errorData);
            } catch (parseError) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data;
        
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
};

// Specific API functions
export const api = {
    // Auth endpoints
    auth: {
        me: () => apiRequest('/api/user'),
        logout: () => apiRequest('/api/auth/logout', { method: 'POST' })
    },
    
    // Events endpoints
    events: {
        getMyEvents: () => apiRequest('/api/my-events'),
        getEvent: (id) => apiRequest(`/api/my-events/${id}`, { method: 'POST' })
    },
    
    // Generic endpoints
    get: (endpoint) => apiRequest(endpoint),
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT', 
        body: JSON.stringify(data)
    }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};

export default api;
