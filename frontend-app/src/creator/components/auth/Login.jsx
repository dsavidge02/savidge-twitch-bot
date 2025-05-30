import { useLocation } from 'react-router-dom';

import { useAuthContext } from "../../contexts/AuthContext";

import './Login.css';
import CustomForm from '../structures/CustomForm/CustomForm';

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
            errorMessage: 'Invalid username.'
        },
        pwd: {
            value: '',
            validator: (value, _) => (typeof value === 'string' && value !== ''),
            valid: true,
            default: '',
            type: 'password',
            placeholder: 'Password',
            errorMessage: 'Invalid password.'
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

    const loginErrors = {
        400: {
            message: "Missing username or password"
        },
        401: {
            message: "Incorrect username or password"
        },
        500: {
            message: "I have no clue how you got here"
        }
    }

    const params = {
        formName,
        initialState,
        formSubmit: handleLogin,
        formNavigate: from,
        formErrors: loginErrors
    };

    return (
        <div className="login-form-container">
            <CustomForm formName={"Login"} initialState={initialState} action={handleLogin} redirect={from} nap={1}/>
        </div>
    );
};

export default Login;