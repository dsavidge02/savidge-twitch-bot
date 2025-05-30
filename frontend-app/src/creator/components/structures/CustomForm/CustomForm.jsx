import { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import CustomErrorMessage from "../CustomErrorMessage/CustomErrorMessage";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";

import "./CustomForm.css";

const sleep = (sec) => new Promise(resolve => setTimeout(resolve, sec * 1000));

const formReducer = (state, action) => {
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
            return resetState
        default:
            return state;
    }
}

const CustomForm = ({ formName, initialState, action, redirect, nap }) => {
    const [formState, setFormState] = useReducer(formReducer, initialState);
    const [submitError, setSubmitError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ type: 'UPDATE_FIELD', field: name, value });
    }

    const validate = () => {
        let allValid = true;
        Object.keys(formState).forEach((fieldName) => {
            const field = formState[fieldName];
            const isValid = field.validator(field.value, formState);

            if (!isValid) {
                allValid = false;
            }
        });
        return allValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(false);
        if(validate()) {
            setSubmitting(true);
            try {
                const submitResponse = await action(formState);
                await sleep(nap);
                if(submitResponse.success) {
                    setFormState({ type: 'RESET_FORM' });
                    navigate(redirect, { replace: true });
                }
                else {
                    setSubmitError(true);
                    console.log('Error with submit');
                }
            }
            finally {
                setSubmitting(false);
            }
        }
    }
    
    return (
        <div className="custom-form-container">
            <div className="custom-form-header">
                <span>{ `${formName}` }</span>
            </div>
            <div className="custom-form-submit-error-container">
                <CustomErrorMessage status={submitError} text={"Form Error"} size={"16px"}/>
            </div>
            <div className="custom-form">
                {Object.keys(formState).map((fieldName) => {
                    const field = formState[fieldName];
                    return (
                        <CustomInput
                            key={fieldName}
                            inputName={fieldName}
                            type={field.type || "text"}
                            placeholder={field.placeholder || fieldName}
                            value={field.value}
                            action={handleFormInputChange}
                            readOnly={field.readOnly || false}
                            error={!field.valid}
                            errorMessage={field.errorMessage || `${field.value} is an invalid ${fieldName}.` }
                            hide={field.hide || false}
                            maxWidth="300px"
                        />
                    );
                })}
            </div>
            <div className="custom-form-footer">
                <CustomButton
                    action={handleSubmit}
                    disabled={!validate()}
                    active={submitting}
                    text={"Submit"}
                    size={"medium"}
                    theme={"default"}
                />
            </div>
        </div>
    );
};

export default CustomForm;