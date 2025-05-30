import { createContext, useContext, useState, useEffect } from "react";

import axios, { axiosPrivate } from "../api/axios";

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

import { decodeToken } from "../utils/decodeToken";

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(false);

    const doLogin = async (submitBody) => {
        try {
            const response = await axios.post("/login",
                JSON.stringify(submitBody),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const newAuth = decodeToken(response?.data.accessToken);
            setAuth(newAuth);
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

    const getId = () => {
        return auth?.user?.id || false;
    }

    const getUsername = () => {
        return auth?.user?.username || "";
    }

    const getRoles = () => {
        return auth?.user?.roles || [];
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

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, doLogin, doLogout, doRegister, getId, getUsername, getRoles }}>
            { children }
        </AuthContext.Provider>
    );
};
