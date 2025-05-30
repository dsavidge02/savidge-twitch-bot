import { jwtDecode } from "jwt-decode";

export const decodeToken = (accessToken) => {
    if (!accessToken) return null;

    try {
        const decoded = jwtDecode(accessToken);
        const user = decoded?.UserInfo;
        return {
            accessToken,
            user: {
                id: user?._id || "",
                username: user?.username || "",
                roles: user?.roles || [],
                twitch_user_id: user?.twitch_user_id || ""
            }
        };
    }
    catch (err) {
        console.error("Invalid access token:", err);
        return null;
    }
};