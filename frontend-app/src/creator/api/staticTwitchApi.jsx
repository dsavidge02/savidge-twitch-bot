const baseURL = "http://localhost:3001";

export const getToken = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/auth/admin/token`);
        if (!res.data.access_token) return "";
        return res.data;
    }
    catch (err) {
        console.error("Unable to verify access token on server:", err);
        return "";
    }
};

export const generateToken = async (axiosPrivate, code) => {
    try {
        const res = await axiosPrivate.post(`${baseURL}/auth/admin/token`,
            {
                code
            }
        );
        if (!res.data) return false;
        return true
    }
    catch (err) {
        console.error("Unable to generate access token on server:", err);
        return false;
    }
}

export const verifyUser = async (axiosPrivate, code) => {
    try {
        const res = await axiosPrivate.post(`${baseURL}/auth/user/verify`,
            {
                code
            }
        );
        if (!res.data) return {};
        return res.data;
    }
    catch (err) {
        console.error("Unable to generate access token on server:", err);
        return {};
    }
};

export const getFollowers = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/followers`);
        if (!res.data.count) return [];
        return res.data;
    }
    catch (err) {
        console.error("Unable to get followers from server:", err);
        return [];
    }
};

export const getSubscribers = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/subscribers`);
        if (!res.data.count) return [];
        return res.data;
    }
    catch (err) {
        console.error("Unable to get subscribers from server:", err);
        return [];
    }
};

export const checkFollowing = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/getFollower`);
        if (!res.data?.follower) return {};
        return res.data.follower;
    }
    catch (err) {
        return {};
    }
};

export const checkSubscriptions = async (axiosPrivate) => {
    try {
        const res = await axiosPrivate.get(`${baseURL}/channel/getSubscriptions`);
        console.log(res.data);
        if (!res.data?.subscriptions) return [];
        return res.data.subscriptions;
    }
    catch (err) {
        return [];
    }
};