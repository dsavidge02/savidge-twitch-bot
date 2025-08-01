import axios from 'axios';
import { enableService, disableService } from './serviceStateManager';

const clientId = process.env.TWITCH_APP_CLIENT_ID;
if (!clientId) throw new Error("Missing TWITCH_APP_CLIENT_ID env variable.");
const clientSecret = process.env.TWITCH_APP_CLIENT_SECRET;
if (!clientSecret) throw new Error("Missing TWITCH_APP_CLIENT_SECRET env variable.");
const streamerId = process.env.TWITCH_STREAMER_ID;
if (!streamerId) throw new Error("Missing TWITCH_STREAMER_ID env variable.");

// Admin token storage
let adminAccessToken: string | null = null;
let adminRefreshToken: string | null = null;
let tokenExpiresAt: number = 0;

// Token refresh function
const refreshAdminToken = async (): Promise<void> => {
    if (!adminRefreshToken) {
        throw new Error('No refresh token available.');
    }

    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: adminRefreshToken
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        adminAccessToken = response.data.access_token;
        adminRefreshToken = response.data.refresh_token;
        tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);

        console.log('Admin token refreshed successfully');
    } catch (err) {
        console.error('Failed to refresh admin token:', err);
        console.warn('Disabling service due to failed token refresh');
        disableService();
        throw new Error('Failed to refresh admin token');
    }
};

// Check if token needs refresh
const validateToken = async (): Promise<void> => {
    if (!adminAccessToken) {
        throw new Error('No admin access token available');
    }

    // Refresh token if it expires in the next 5 minutes
    if (Date.now() >= tokenExpiresAt - (5 * 60 * 1000)) {
        await refreshAdminToken();
    }
};

// Centralized Twitch request function with admin token
export const twitchRequest = async <T>(url: string, options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, string>;
    data?: any;
    headers?: Record<string, string>;
} = {}): Promise<T> => {
    await validateToken();

    const config = {
        method: options.method || 'GET',
        url,
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
        },
        params: options.params,
        data: options.data,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            // Token might be expired, try refreshing once
            await refreshAdminToken();
            
            // Retry the request with new token
            config.headers.Authorization = `Bearer ${adminAccessToken}`;
            const retryResponse = await axios(config);
            return retryResponse.data;
        }
        throw err;
    }
};

// Save admin tokens
export const saveAdminTokens = (accessToken: string, refreshToken: string, expiresIn: number): void => {
    adminAccessToken = accessToken;
    adminRefreshToken = refreshToken;
    tokenExpiresAt = Date.now() + (expiresIn * 1000);
    console.log('Admin tokens saved successfully - enabling service.');
    enableService();
};

// Get current admin access token (for external use if needed)
export const getAdminAccessToken = (): string | null => {
    return adminAccessToken;
};

// Check if admin tokens are available
export const hasAdminTokens = (): boolean => {
    return adminAccessToken !== null && adminRefreshToken !== null;
}; 

// Type definitions
interface AdminTokens {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number;
}

// Get admin tokens
export const getAdminTokens = (): AdminTokens => {
    return {
        accessToken: adminAccessToken,
        refreshToken: adminRefreshToken,
        expiresAt: tokenExpiresAt
    }   
}