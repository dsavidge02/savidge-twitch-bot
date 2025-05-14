import { useReducer } from 'react';
import './AuthForm.css';

const AuthFormReducer = (state, action) => {
    switch(action.type) {
        case 'UPDATE_FIELD':
            const { field, value } = action;
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
    const { formName, initialState, formSubmit } = params;
    const [authFormState, setAuthFormState] = useReducer(AuthFormReducer, initialState);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            formSubmit(authFormState);
        }
    }

    return (
        <div className="auth-form-container-border includes--border">
            <div className="auth-form-container">
                <div className="auth-form-header-container">
                    <p>{`${formName}`}</p>
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
                                />
                                {!field.valid && (
                                    <p className="auth-form-error-message">{ field.errorMessage || `${field.value} is an invalid ${fieldName}.` }</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="auth-form-footer-container">
                    <button onClick={handleSubmit} disabled={!isValid()}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;