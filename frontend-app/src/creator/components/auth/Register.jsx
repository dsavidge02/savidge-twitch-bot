import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useLocalStorage from "../../hooks/useLocalStorage";

import { verifyUser } from "../../api/staticTwitchApi";
import { useAuthContext } from "../../contexts/AuthContext";

import CustomButton from "../structures/CustomButton/CustomButton";
import CustomForm from "../structures/CustomForm/CustomForm";

import "./Register.css";
import CustomErrorMessage from "../structures/CustomErrorMessage/CustomErrorMessage";

const Register = () => {
    const [isExchanging, setIsExchanging] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();

    const [userOauthState, setUserOauthState] = useLocalStorage("twitch_user_oauth_state", "");

    const [newUser, setNewUser] = useState({
        valid: 0,
        email: "",
        login: "",
        twitch_user_id: ""
    });

    const { doRegister } = useAuthContext();

    const [registerHint, setRegisterHint] = useState("");

    useEffect(() => {
        const exchangeCode = async (code) => {
            setIsExchanging(true);
            try {
                const verifiedUser = await verifyUser(axiosPrivate, code);
                const { email, login, twitch_user_id } = verifiedUser;
                if (email && login && twitch_user_id) {
                    setNewUser({ valid: 1, email, login, twitch_user_id});
                }
                setSearchParams({});
            }
            catch (err) {
                setNewUser({ valid: -1, email: "", login: "", twitch_user_id: "" });
                console.error("User token exchange failed:", err);
                setRegisterHint("You must be following or subscribed to savidge_af on twitch!");
            }
            finally {
                setIsExchanging(false);
            }
        };

        const code = searchParams.get("code");
        const returnedState = searchParams.get("state");
        const error = searchParams.get("error");

        const init = async () => {
            if (code && returnedState && returnedState === userOauthState) {
                setUserOauthState("");
                await exchangeCode(code);
            }
            else if (code && returnedState && returnedState !== userOauthState) {
                setUserOauthState("");
            }
            else if (error && returnedState && returnedState == userOauthState) {
                setUserOauthState("");
                setRegisterHint("You must allow access from twitch!");
            }
        };

        init();
    }, []);

    const handleExchange = async (e) => {
        e.preventDefault();

        const user_oauth_state = crypto.randomUUID();
        setUserOauthState(user_oauth_state);

        const params = new URLSearchParams({
            response_type: "code",
            client_id: "oq27qs5xtr75kpnrwyp3xixylz1crt",
            force_verify: true,
            redirect_uri: "http://localhost:5173/register",
            scope: "user:read:subscriptions user:read:email",
            state: user_oauth_state
        });

        const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
        window.location.href = link;
    };

    const getInitialState = () => {
        return {
            email: {
                value: newUser.email,
                validator: (value, _) => /^[^@]+@[^@]+\.[^@]+$/.test(value),
                valid: true,
                default: '',
                placeholder: 'Email',
                readOnly: true,
                errorMessage: "Invalid email address."
            },
            username: {
                value: newUser.login,
                validator: (value, _) => /^[A-Za-z][A-Za-z0-9-_]{3,23}$/.test(value),
                valid: true,
                default: '',
                placeholder: 'Username',
                readOnly: true,
                errorMessage: "Invalid username."
            },
            twitch_user_id: {
                value: newUser.twitch_user_id,
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
        }
    }

    const handleRegister = async (state) => {
        const submitBody = {
            email: state.email.value,
            username: state.username.value,
            password: state.pwd.value,
            twitch_user_id: state.twitch_user_id.value,
        };
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
    };

    return (
        <div className="register-container">
            <div className="register-exchange-container">
                <CustomButton
                    action={handleExchange}
                    disabled={false}
                    active={isExchanging}
                    text={"Sign Up With Twitch"}
                    size={"medium"}
                />
            </div>
            {
                newUser.valid === 1 && (
                    <div className="register-form-container">
                        <CustomForm
                            formName={"Register"}
                            initialState={getInitialState()}
                            action={handleRegister}
                            redirect={"/login"}
                            formErrors={registerErrors}
                        />
                    </div>
                )
            }
            {
                registerHint !== "" && (
                    <div className="register-hint-container">
                        <CustomErrorMessage
                            status={true}
                            text={registerHint}
                            size={"16px"}
                        />
                    </div>
                )
            }
        </div>
    )
};

export default Register;