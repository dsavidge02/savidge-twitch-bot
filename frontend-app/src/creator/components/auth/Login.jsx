import AuthForm from "./AuthForm";

const Login = () => {
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

    const handleLogin = (state) => {
        const submitBody = {
            username: state.username.value,
            password: state.pwd.value
        };
        console.log(submitBody);
    }

    const params = {
        formName,
        initialState,
        formSubmit: handleLogin
    };

    return (
        <AuthForm params={params} />
    );
};

export default Login;