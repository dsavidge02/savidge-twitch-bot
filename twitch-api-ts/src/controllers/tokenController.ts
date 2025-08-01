import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import qs from 'qs';
import { verifyUser } from '../utils/twitchHelper';
import { saveAdminTokens, getAdminTokens } from '../utils/twitchAdminService';

// Type definitions
interface TokenInitResponse {
    client_id: string;
    force_verify: boolean;
    redirect_uri: string;
    response_type: string;
    scope: string[];
    state: string;
}

interface TokenGenerateRequest {
    code: string;
    state: string;
    scopes: string[];
    type: 'user' | 'admin';
}

interface TwitchTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string[];
    token_type: string;
}

const clientId = process.env.TWITCH_APP_CLIENT_ID;
if (!clientId) throw new Error("Missing TWITCH_APP_CLIENT_ID env variable.");
const clientSecret = process.env.TWITCH_APP_CLIENT_SECRET;
if (!clientSecret) throw new Error("Missing TWITCH_APP_CLIENT_SECRET env variable.");
const userRedirectUri = process.env.TWITCH_APP_REDIRECT_URI;
if (!userRedirectUri) throw new Error("Missing TWITCH_APP_REDIRECT_URI env variable.");
const adminRedirectUri = process.env.TWITCH_APP_ADMIN_REDIRECT_URI;
if (!adminRedirectUri) throw new Error("Missing TWITCH_APP_ADMIN_REDIRECT_URI env variable.");

// In-memory storage for OAuth state (in production, use Redis or database)
const oauthStates = new Map<string, { scopes: string[], type: 'user' | 'admin', timestamp: number }>();

export const handleInitToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const type = req.query.type as string;

        // Validate type parameter
        if (!type || !['user', 'admin'].includes(type)) {
            res.status(400).json({ 
                error: 'Invalid type parameter. Must be either "user" or "admin"' 
            });
            return;
        }

        // Define scopes based on type
        const scopes = type === 'user' 
            ? ['user:read:subscriptions', 'user:read:email']
            : ['channel:read:subscriptions', 'moderator:read:followers'];

        // Generate random state
        const state = uuidv4();

        // Store state with scopes and type for verification
        oauthStates.set(state, {
            scopes,
            type: type as 'user' | 'admin',
            timestamp: Date.now()
        });

        // Clean up old states (older than 10 minutes)
        const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
        for (const [key, value] of oauthStates.entries()) {
            if (value.timestamp < tenMinutesAgo) {
                oauthStates.delete(key);
            }
        }

        // Create response object
        const tokenInitData: TokenInitResponse = {
            client_id: clientId,
            force_verify: true,
            redirect_uri: type === 'user' ? userRedirectUri : adminRedirectUri,
            response_type: 'code',
            scope: scopes,
            state: state
        };

        res.status(200).json(tokenInitData);
    }
    catch (error) {
        console.error('Error in initToken:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

export const handleGenerateToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, state, scopes, type } = req.body as TokenGenerateRequest;

        // Validate required fields
        if (!code || !state || !scopes || !type) {
            res.status(400).json({ 
                error: 'Missing required fields: code, state, scopes, type' 
            });
            return;
        }

        // Validate type
        if (!['user', 'admin'].includes(type)) {
            res.status(400).json({ 
                error: 'Invalid type parameter. Must be either "user" or "admin"' 
            });
            return;
        }

        // Verify state exists and is valid
        const storedState = oauthStates.get(state);
        if (!storedState) {
            res.status(400).json({ 
                error: 'Invalid or expired state parameter' 
            });
            return;
        }

        // Verify type matches
        if (storedState.type !== type) {
            res.status(400).json({ 
                error: 'State type mismatch' 
            });
            return;
        }

        // Verify scopes match
        const expectedScopes = type === 'user' 
            ? ['user:read:subscriptions', 'user:read:email']
            : ['channel:read:subscriptions', 'moderator:read:followers'];

        const scopesMatch = scopes.length === expectedScopes.length && 
            scopes.every(scope => expectedScopes.includes(scope));

        if (!scopesMatch) {
            res.status(400).json({ 
                error: 'Scope mismatch' 
            });
            return;
        }

        // Exchange authorization code for access token
        const tokenRequestBody = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: type === 'user' ? userRedirectUri : adminRedirectUri
        });

        const tokenResponse = await axios.post<TwitchTokenResponse>(
            'https://id.twitch.tv/oauth2/token',
            tokenRequestBody,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // Clean up the used state
        oauthStates.delete(state);

        if (type === 'user') {
            // USER FLOW: Use verifyUser from twitchHelper
            try {
                const response = await verifyUser(tokenResponse.data.access_token);
                
                res.status(200).json(response);
            } catch (error) {
                console.error('Error verifying user status:', error);
                res.status(200).json({ 
                    success: false,
                    message: 'Failed to verify user status'
                });
            }
        } else {
            // ADMIN FLOW: Store tokens using centralized service and enable service
            try {
                saveAdminTokens(
                    tokenResponse.data.access_token,
                    tokenResponse.data.refresh_token,
                    tokenResponse.data.expires_in
                );

                res.status(200).json({ 
                    success: true,
                    message: 'Admin tokens stored successfully.'
                });
            } catch (error) {
                console.error('Error storing admin tokens:', error);
                res.status(200).json({ 
                    success: false,
                    message: 'Failed to store admin tokens.'
                });
            }
        }

    }
    catch (err) {
        console.error('Error in generateToken:', err);
        
        // Handle specific Twitch API errors
        if (axios.isAxiosError(err) && err.response) {
            res.status(err.response.status).json({ 
                error: 'Twitch API error',
                details: err.response.data 
            });
        } else {
            res.status(500).json({ 
                error: 'Internal server error' 
            });
        }
    }
};

export const handleGetTokens = async (req: Request, res: Response): Promise<void> => {
    try {
        const tokens = await getAdminTokens();
        res.status(200).json(tokens);
    }
    catch (err) {
        console.error('Error in getToken:', err);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};