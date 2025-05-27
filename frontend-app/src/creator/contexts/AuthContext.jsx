import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";

import axios, { axiosPrivate } from "../api/axios";

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tryRefresh = async() => {
            try {
                const response = await axios.get('/refresh', {
                    withCredentials: true
                });
                setAuth(prev => ({
                    ...prev,
                    accessToken: response.data.accessToken 
                }));
            }
            catch (err) {
                console.log("No refresh token or refresh failed:", err);
                setAuth({});
            }
            finally {
                setLoading(false);
            }
        };

        if (!auth?.accessToken && loading) {
            tryRefresh();
        }
        else {
            setLoading(false);
        }

    }, [auth?.accessToken]);

    const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined;

    const isAuth = !!decoded;
    const id =  isAuth ? decoded.UserInfo?._id : "";
    const username = isAuth ? decoded?.UserInfo?.username : "";
    const roles = isAuth ? decoded?.UserInfo?.roles : [];

    const doLogin = async (submitBody) => {
        try {
            const response = await axios.post("/login",
                JSON.stringify(submitBody),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            setAuth({ accessToken });
            return { success: true, status: 200 };
        }
        catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
                return { success: false, status: 500 };
            }
            else if (err.response?.status === 400) {
                console.log('Missing username or password');
                return { success: false, status: 400 };
            }
            else if (err.response?.status === 401) {
                console.log('Unauthorized');
                return { success: false, status: 401 };
            }
            else {
                console.log('Login Failed');
                return { success: false, status: 500 };
            }
        }
    }

    const doRegister = async (submitBody) => {
        try {
            const response = await axios.post("/register",
                JSON.stringify(submitBody),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            return { success: true, status: 201 };
        }
        catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
                return { success: false, status: 500 };
            }
            else if (err.response?.status === 400) {
                console.log('Missing email, username or password');
                return { success: false, status: 400 };
            }
            else if (err.response?.status === 409) {
                console.log('User already exists');
                return { success: false, status: 409 };
            }
            else {
                console.log('Register Failed');
                return { success: false, status: 500 };
            }
        }
    }

    const doLogout = async () => {
        setAuth({});
        try {
            const response = await axios.get('/logout', {
                withCredentials: true
            });
            console.log('user logged out');
        }
        catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return (
            <div className="loading-content">
                LOADING CONTENT
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, isAuth, id, username, roles, doLogin, doLogout, doRegister }}>
            { children }
        </AuthContext.Provider>
    );
};
