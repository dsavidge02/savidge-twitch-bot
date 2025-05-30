import CustomErrorMessage from "../CustomErrorMessage/CustomErrorMessage";

import "./CustomInput.css";

const CustomInput = ({ inputName, type, placeholder, value, action, readOnly, error, errorMessage, size=16, maxWidth="200px", hide=false }) => {
    const errorSize = size - 2;
    
    return (
        <>
            {
                !hide && (
                    <div className="custom-input-container" style={{
                        maxWidth
                    }}>
                        <input
                            className="custom-input"
                            name={inputName} 
                            type={type}
                            placeholder={placeholder}
                            value={value}
                            onChange={action}
                            readOnly={readOnly}
                        />
                        <CustomErrorMessage status={error} text={errorMessage} size={`${errorSize-2}px`}/>
                    </div>
                )
            }
        </>
    );
};

export default CustomInput;