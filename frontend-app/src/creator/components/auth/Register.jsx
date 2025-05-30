import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { useAuthContext } from "../../contexts/AuthContext";
import TwitchVerify from "./twitch/TwitchVerify";

import CustomForm from "../structures/CustomForm/CustomForm";

import './Register.css';

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const hasRefreshed = useRef(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code || (user?.email && user?.login && user?.twitch_user_id)) {
            return;
        }

        const verifyUser = async () => {
            try {
                setLoading(true);
                const res = await axiosPrivate.post("http://localhost:3001/auth/user/verify", { code });
                if (res.status === 200) {
                    const { email, login, twitch_user_id } = res.data;
                    console.log(email, login, twitch_user_id)
                    setUser({
                        email,
                        login,
                        twitch_user_id
                    });
                    setLoading(false);
                    return;
                }
                console.error("How did we get here?");
                setLoading(false);
                return;
            }
            catch (err) {
                if (err.response?.status === 401) {
                    console.log('You should follow me bro');
                    setErrorMessage("Follow me now dog");
                    setLoading(false);
                    return;
                }
                console.error("Good try bucko:", err);
                navigate("/login");
                return;
            }
        }

        if (!hasRefreshed.current) {
            hasRefreshed.current = true;
            verifyUser();
        }
    }, []);

    const location = useLocation();
    const from = location.state?.from?.pathname || "/login";

    const { doRegister } = useAuthContext();

    const formName = "REGISTER";

    const initialState = {
        email: {
            value: user.email,
            validator: (value, _) => /^[^@]+@[^@]+\.[^@]+$/.test(value),
            valid: true,
            default: '',
            placeholder: 'Email',
            readOnly: true,
            errorMessage: "Invalid email address."
        },
        username: {
            value: user.login,
            validator: (value, _) => /^[A-Za-z][A-Za-z0-9-_]{3,23}$/.test(value),
            valid: true,
            default: '',
            placeholder: 'Username',
            readOnly: true,
            errorMessage: "Invalid username."
        },
        twitch_user_id: {
            value: user.twitch_user_id,
            validator: (value, _) => /^[0-9]{6,12}$/.test(value),
            valid: true,
            default: '',
            placeholder: 'twitch user id',
            readOnly: true,
            errorMessage: "Invalid twitch user id.",
            hide: true
        },
        pwd: {
            value: '',
            validator: (value, _) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(value),
            valid: true,
            default: '',
            type: 'password',
            placeholder: 'Password',
            errorMessage: 'Invalid password.'
        },
        confirmPwd: {
            value: '',
            validator: (value, state) => value === state.pwd.value,
            valid: true,
            default: '',
            type: 'password',
            placeholder: 'Confirm Password',
            errorMessage: 'Password does not match.'
        }
    };

    const handleRegister = async (state) => {
        const submitBody = {
            email: state.email.value,
            username: state.username.value,
            password: state.pwd.value,
            twitch_user_id: state.twitch_user_id.value
        };
        console.log(submitBody);
        const response = await doRegister(submitBody);
        return response;
    };

    const registerErrors = {
        400: {
            message: "Missing email, username or password"
        },
        409: {
            message: "User already exists",
            navigate: {
                url: "/login",
                text: "Go to login"
            }
        },
        500: {
            message: "I have no clue how you got here"
        }
    }

    return (
        <>
            {
                loading && (
                    <span>Verifying user...</span>
                )
            }
            {
                !loading && (
                    <>
                    {
                        user.email && user.login && (
                            <div className="register-form-container">
                                <CustomForm formName={"Register"} initialState={initialState} action={handleRegister} redirect={from} formErrors={registerErrors} />
                            </div>
                        )
                    }
                    {
                        !user.email && !user.login && (
                            <>
                                <TwitchVerify />
                                {
                                    errorMessage !== "" && (
                                        <span>{errorMessage}</span>
                                    )
                                }
                            </>
                        )
                    }
                    </>
                )
            }
        </>
    );
};

export default Register;