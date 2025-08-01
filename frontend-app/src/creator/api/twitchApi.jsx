// THIS CAN GET CHANGED TO A API SPECIFIC URL LATER
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

// Get followers
export const getFollowers = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/followers`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get followers:", err);
        return [];
    }
};

// Get subscribers with full data
export const getSubscribers = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/subscribers`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get subscribers:", err);
        return [];
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

// Initialize token generation of a given type
export const initToken = async (axiosPrivate, type) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/token/init?type=${type}`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to initialize token:", err);
        throw err;
    }
};

// Generate token from token data
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

// Get token data from service
export const getToken = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/token`);
        return res.data;
    }
    catch (err) {
        console.error("Unable to get token:", err);
        throw err;
    }
}