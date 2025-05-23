import { useLocation } from 'react-router-dom';

import { useAuthContext } from "../../contexts/AuthContext";
import AuthForm from "./AuthForm";

const LOGIN_URL = '/login';

const Login = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/savidge_af";

    const { doLogin } = useAuthContext();

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
        const response = await doLogin(submitBody);
        return response;
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