const baseURL = "http://localhost:3001";

// Get service status to check if admin token is configured
export const getServiceStatus = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/status`);
        return true; // Service is up
    }
    catch (err) {
        console.error("Unable to get service status:", err);
        return false; // Service is down
    }
};

// Initialize OAuth flow (get OAuth parameters)
export const initToken = async (axiosPrivate, type) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/token/init?type=${type}`);
        return res.data;
    }
    catch (err) {
        console.error(`Unable to initialize ${type} token flow:`, err);
        throw err;
    }
};

// Generate token from authorization code
export const generateToken = async (axiosPrivate, tokenData) => {
    try {
        const res = await axiosPrivate.post(`${baseURL}/token/generate`, tokenData);
        return res.data;
    }
    catch (err) {
        console.error("Unable to generate token:", err);
        throw err;
    }
};

// Legacy functions for backward compatibility (if needed)
export const getToken = async (axiosPrivate) => {
    try {
        const status = await getServiceStatus(axiosPrivate);
        if (status.details.hasAdminTokens) {
            return {
                access_token: "ADMIN_TOKEN_CONFIGURED",
                refresh_token: "ADMIN_TOKEN_CONFIGURED", 
                expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
            };
        }
        return "";
    }
    catch (err) {
        console.error("Unable to get token status:", err);
        return "";
    }
};

// User verification (new flow)
export const verifyUser = async (axiosPrivate, { code, state, scopes }) => {
    try {
        const res = await generateToken(axiosPrivate, {
            code, state, scopes, type: 'user'
        });
        return res; // Returns { success: boolean, message: string }
    }
    catch (err) {
        console.error("Unable to verify user:", err);
        return { success: false, message: "Verification failed" };
    }
};

// Admin token setup (new flow)
export const setupAdminToken = async (axiosPrivate, { code, state, scopes }) => {
    try {
        const res = await generateToken(axiosPrivate, {
            code, state, scopes, type: 'admin'
        });
        return res; // Returns { success: boolean, message: string }
    }
    catch (err) {
        console.error("Unable to setup admin token:", err);
        return { success: false, message: "Admin token setup failed" };
    }
};

// Get followers with full data (now with pagination support)
export const getFollowers = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/followers`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get followers from server:", err);
        return { count: 0, followers: [] };
    }
};

// Get followers count only (more efficient)
export const getFollowersCount = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/followers/count`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get followers count:", err);
        return { count: 0 };
    }
};

// Get subscribers with full data (now with pagination support)
export const getSubscribers = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/subscribers`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get subscribers from server:", err);
        return { count: 0, subscribers: [] };
    }
};

// Get subscribers count only (more efficient)
export const getSubscribersCount = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/subscribers/count`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get subscribers count:", err);
        return { count: 0 };
    }
};

// Check if user is following
export const checkFollowing = async (axiosPrivate, userId) => {
    try {
        const followersData = await getFollowers(axiosPrivate);
        return followersData.followers.some(follower => follower.user_id === userId);
    }
    catch (err) {
        console.error("Unable to check following:", err);
        return false;
    }
};

// Check if user is subscribed
export const checkSubscriptions = async (axiosPrivate, userId) => {
    try {
        const subscribersData = await getSubscribers(axiosPrivate);
        return subscribersData.subscribers.some(subscriber => subscriber.user_id === userId);
    }
    catch (err) {
        console.error("Unable to check subscriptions:", err);
        return false;
    }
};