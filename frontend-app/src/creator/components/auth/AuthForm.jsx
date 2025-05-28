import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthFormButton from './AuthFormButton';
import './AuthForm.css';

import CustomButton from '../structures/Button/CustomButton';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AuthFormReducer = (state, action) => {
    switch(action.type) {
        case 'UPDATE_FIELD':
            const { field, value } = action;
            if (state[field]?.readOnly) return state;
            const validator = state[field].validator;
            const isValid = validator(value, state);
            
            return {
                ...state,
                [field]: {
                    ...state[field],
                    value,
                    valid: isValid
                }
            };
        case 'RESET_FORM':
            const resetState = {};
            for (const key in state) {
                resetState[key] = {
                    ...state[key],
                    value: state[key].default,
                    valid: true
                };
            }
            return resetState;
        default:
            return state;
    }
}

const AuthForm = ({ params }) => {
    const navigate = useNavigate();
    const { formName, initialState, formSubmit, formNavigate, formErrors } = params;
    const [authFormState, setAuthFormState] = useReducer(AuthFormReducer, initialState);
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setAuthFormState({ type: 'UPDATE_FIELD', field: name, value });
    }

    const isValid = () => {
        let allValid = true;
        Object.keys(authFormState).forEach((fieldName) => {
            const field = authFormState[fieldName];
            const isValid = field.validator(field.value, authFormState);

            if (!isValid) {
                allValid = false;
            }

        });
        return allValid;
    }

    const validate = () => {
        let allValid = true;
        Object.keys(authFormState).forEach((fieldName) => {
            const field = authFormState[fieldName];
            const isValid = field.validator(field.value, authFormState);

            if (!isValid) {
                allValid = false;
            }

            setAuthFormState({
                type: 'UPDATE_FIELD',
                field: fieldName,
                value: field.value
            });
        });
        return allValid;
    }

    const updateSubmitError = (status) => {
        const { message, navigate } = formErrors[status];
        setSubmitError({
            status: true,
            message,
            navigate
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        if (validate()) {
            setIsSubmitting(true);
            try {
                const submitResponse = await formSubmit(authFormState);
                await sleep(500);

                if (submitResponse.success) {
                    setAuthFormState({ type: 'RESET_FORM' });
                    navigate(formNavigate, { replace: true });
                }
                else {
                    updateSubmitError(submitResponse.status);
                    console.log('Error with submit');
                }
            }
            finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        // <div className="auth-form-container-border">
            <div className="auth-form-container">
                <div className="auth-form-header-container">
                    <p>{`${formName}`}</p>
                </div>
                    <div className="auth-form-submit-error-container">
                        <div className={`auth-form-submit-error ${submitError?.status ? 'visible' : 'hidden'} `}>
                            {
                                submitError?.message ? (
                                    <p className="auth-form-error-message">
                                        {submitError.message}
                                    </p>
                                ) : (
                                    <p className="auth-form-error-message">
                                        &nbsp;
                                    </p>
                                )
                            }
                            {
                                submitError?.navigate ? (
                                    <a 
                                        href={submitError.navigate.url} 
                                        className="auth-form-error-link"
                                    >
                                        {submitError.navigate.text}
                                    </a>
                                ) : (
                                    <a
                                        className="auth-form-error-link"
                                    >
                                        &nbsp;
                                    </a>
                                )
                            }
                        </div>
                    </div>
                <div className="auth-form">
                    {Object.keys(authFormState).map((fieldName) => {
                        const field = authFormState[fieldName];
                        return (
                            <div key={fieldName} className="auth-form-field">
                                <input
                                    className="auth-form-field-input"
                                    name={fieldName}
                                    type={field.type || "text"}
                                    placeholder={field.placeholder || fieldName}
                                    value={field.value}
                                    onChange={handleFormInputChange}
                                    readOnly={field.readOnly || false}
                                />
                                {!field.valid && (
                                    <p className="auth-form-error-message">{ field.errorMessage || `${field.value} is an invalid ${fieldName}.` }</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="auth-form-footer-container">
                    <CustomButton
                        action={handleSubmit}
                        disabled={!isValid()}
                        active={isSubmitting}
                        text={'Submit'}
                    >
                    </CustomButton>
                    {/* <AuthFormButton onClick={handleSubmit} disabled={!isValid()} loading={isSubmitting}>
                        Submit
                    </AuthFormButton> */}
                </div>
            </div>
        // </div>
    );
};

export default AuthForm;