import axios from 'axios';
import { twitchRequest } from './twitchAdminService';

const clientId = process.env.TWITCH_APP_CLIENT_ID;
if (!clientId) throw new Error("Missing TWITCH_APP_CLIENT_ID env variable.");
const streamerId = process.env.TWITCH_STREAMER_ID;
if (!streamerId) throw new Error("Missing TWITCH_STREAMER_ID env variable.");

interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email?: string;
    created_at: string;
}

interface TwitchUsersResponse {
    data: TwitchUser[];
}

interface TwitchFollower {
    followed_at: string;
    user_id: string;
    user_login: string;
    user_name: string;
}

interface TwitchFollowersResponse {
    data: TwitchFollower[];
    total: number;
    pagination: {
        cursor?: string;
    };
}

interface TwitchSubscriber {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    gifter_id: string;
    gifter_login: string;
    gifter_name: string;
    is_gift: boolean;
    tier: string;
    user_id: string;
    user_login: string;
    user_name: string;
}

interface TwitchSubscribersResponse {
    data: TwitchSubscriber[];
    total: number;
    points: number;
    pagination: {
        cursor?: string;
    };
}

// Get the id of the user from the access token
export const getUserIdFromToken = async (accessToken: string): Promise<string> => {
    const response = await axios.get<TwitchUsersResponse>('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.data.data || response.data.data.length === 0) {
        return '';
    }

    return response.data.data[0].id;
};

// Check if a user is following the streamer which requires admin token
export const getFollowers = async (userId?: string): Promise<TwitchFollower[]> => {
    try {
        const allFollowers: TwitchFollower[] = [];
        let cursor: string | undefined;
        let hasMorePages = true;

        while (hasMorePages) {
            const params: Record<string, string> = {
                broadcaster_id: streamerId,
                first: '10' // Maximum allowed by Twitch API
            };
            
            if (userId) {
                params.user_id = userId;
            }

            if (cursor) {
                params.after = cursor;
            }

            const response = await twitchRequest<TwitchFollowersResponse>(
                'https://api.twitch.tv/helix/channels/followers',
                { params }
            );

            allFollowers.push(...response.data);

            // Check if there are more pages
            cursor = response.pagination?.cursor;
            hasMorePages = !!cursor;

            // If we're checking for a specific user, we can stop after first page
            if (userId) {
                break;
            }

            // Add a small delay to avoid rate limiting
            if (hasMorePages) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return allFollowers;
    } 
    catch (err) {
        console.error('Error getting followers:', err);
        return [];
    }
};

// Check if a user is following the streamer which requires user id
export const checkUserFollowing = async (userId: string): Promise<boolean> => {
    try {
        const followers = await getFollowers(userId);
        return followers.length > 0;
    }
    catch (err) {
        console.error('Error checking following status:', err);
        return false;
    }
};

// Get all subscribers with pagination support
export const getSubcribers = async (userId?: string): Promise<TwitchSubscriber[]> => {
    try {
        const allSubscribers: TwitchSubscriber[] = [];
        let cursor: string | undefined;
        let hasMorePages = true;

        while (hasMorePages) {
            const params: Record<string, string> = {
                broadcaster_id: streamerId,
                first: '100' // Maximum allowed by Twitch API
            };
            
            if (userId) {
                params.user_id = userId;
            }

            if (cursor) {
                params.after = cursor;
            }

            const response = await twitchRequest<TwitchSubscribersResponse>(
                'https://api.twitch.tv/helix/subscriptions',
                { params }
            );

            allSubscribers.push(...response.data);

            // Check if there are more pages
            cursor = response.pagination?.cursor;
            hasMorePages = !!cursor;

            // If we're checking for a specific user, we can stop after first page
            if (userId) {
                break;
            }

            // Add a small delay to avoid rate limiting
            if (hasMorePages) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return allSubscribers;
    }
    catch (err) {
        console.error('Error getting subscribers:', err);
        return [];
    }
}

// Check if a user is subscribed to the streamer which requires user id
export const checkUserSubscribed = async (userId: string): Promise<boolean> => {
    try {
        const subscribers = await getSubcribers(userId);
        return subscribers.length > 0;
    }
    catch (err) {
        console.error('Error checking subscription status:', err);
        return false;
    }
};

export const verifyUser = async (accessToken: string): Promise<{success: boolean, message: string}> => {
    const userId = await getUserIdFromToken(accessToken);

    if (userId === '') {
        return { success: false, message: 'Failed to verify Twitch Account.' };
    }

    const isFollowing = await checkUserFollowing(userId);
    const isSubscribed = await checkUserSubscribed(userId);
    
    if (isFollowing || isSubscribed) {
        return { success: true, message: 'Thanks for following my content!' };
    }
    else {
        return { success: false, message: 'You are not following or subscribed to my channel.' };
    }
};


