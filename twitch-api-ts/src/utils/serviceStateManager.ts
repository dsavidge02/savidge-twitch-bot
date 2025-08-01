import { hasAdminTokens } from './twitchAdminService';

// Service state management
let serviceEnabled = false;

// Check if service is ready to accept user requests
export const isServiceEnabled = (): boolean => {
    return serviceEnabled && hasAdminTokens();
};

// Enable the service (called when admin token is successfully stored)
export const enableService = (): void => {
    serviceEnabled = true;
    console.log('Twitch API service is now ENABLED and ready to accept user requests');
};

// Disable the service (called when admin token is removed/expired)
export const disableService = (): void => {
    serviceEnabled = false;
    console.log('Twitch API service is now DISABLED - admin token required');
};

// Get service status for monitoring
export const getServiceStatus = (): { enabled: boolean; hasAdminTokens: boolean; ready: boolean } => {
    const hasTokens = hasAdminTokens();
    const ready = serviceEnabled && hasTokens;
    
    return {
        enabled: serviceEnabled,
        hasAdminTokens: hasTokens,
        ready
    };
};

// Initialize service state
export const initializeServiceState = (): void => {
    // Service starts disabled until admin sets up tokens
    serviceEnabled = false;
    console.log('Twitch API service starting in DISABLED state - admin token required');
}; 