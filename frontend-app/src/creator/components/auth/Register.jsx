import { useLocation } from 'react-router-dom';

import AuthForm from "./AuthForm";

const Register = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/savidge_af/register";

    const formName = "REGISTER";

    const initialState = {
        email: {
            value: '',
            validator: (value, _) => /^[^@]+@[^@]+\.[^@]+$/.test(value),
            valid: true,
            default: '',
            placeholder: 'Email'
        },
        username: {
            value: '',
            validator: (value, _) => /^[A-Za-z][A-Za-z0-9-_]{3,23}$/.test(value),
            valid: true,
            default: '',
            placeholder: 'Username'
        },
        pwd: {
            value: '',
            validator: (value, _) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(value),
            valid: true,
            default: '',
            type: 'password',
            placeholder: 'Password'
        },
        confirmPwd: {
            value: '',
            validator: (value, state) => value === state.pwd.value,
            valid: true,
            default: '',
            type: 'password',
            placeholder: 'Confirm Password'
        }
    };

    const handleRegister = (state) => {
        const submitBody = {
            email: state.email.value,
            username: state.username.value,
            password: state.pwd.value
        };
        console.log(submitBody);
    };

    const params = {
        formName,
        initialState,
        formSubmit: handleRegister,
        formNavigate: from
    };
    
    return (
        <AuthForm params={params} />
    );
};

export default Register;