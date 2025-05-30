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
                roles: user?.roles || []
            }
        };
    }
    catch (err) {
        console.error("Invalid access token:", err);
        return null;
    }
};