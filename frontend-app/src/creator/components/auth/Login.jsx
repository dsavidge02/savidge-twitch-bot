import { useLocation } from 'react-router-dom';

import { useAuthContext } from "../../contexts/AuthContext";
import AuthForm from "./AuthForm";

import axios from "../../api/axios";
const LOGIN_URL = '/login';

const Login = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const { setAuth } = useAuthContext();

    const formName = "LOGIN";

    const initialState = {
        username: {
            value: '',
            validator: (value, _) => (typeof value === 'string' && value !== ''),
            valid: true,
            default: '',
            placeholder: 'Username',
        },
        pwd: {
            value: '',
            validator: (value, _) => (typeof value === 'string' && value !== ''),
            valid: true,
            default: '',
            placeholder: 'Password',
        }
    };

    const handleLogin = async (state) => {
        const submitBody = {
            username: state.username.value,
            password: state.pwd.value
        };
        console.log(submitBody);

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(submitBody),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            setAuth({ accessToken });
            return true;
        }
        catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            }
            else if (err.response?.status === 400) {
                console.log('Missing username or password');
            }
            else if (err.response?.status === 401) {
                console.log('Unauthorized');
            }
            else {
                console.log('Login Failed');
            }
            return false;
        }
    }

    const params = {
        formName,
        initialState,
        formSubmit: handleLogin,
        formNavigate: from
    };

    return (
        <AuthForm params={params} />
    );
};

export default Login;