import CustomSpinner from "../CustomSpinner/CustomSpinner";

import "./CustomButton.css";

const spinnerSizes = {
    small: {
        radius: "15px",
        thickness: "2px"
    },
    medium: {
        radius: "30px",
        thickness: "3px"
    },
    large: {
        radius: "50px",
        thickness: "5px"
    },
};

const CustomButton = ({ action, disabled, active, text, size, theme}) => {
    const isDisabled = disabled ? disabled : active;
    const style = disabled ? "disabled" : active ? "active" : "";

    return (
        <button
            onClick={action}
            disabled={isDisabled}
        >
            <div className={ `custom-button-container ${size} ${style}` }>
                <span className={ `custom-button-content ${size} ${style}` }>
                    {text}
                </span>
                {style === "active" && (
                    <CustomSpinner size={spinnerSizes[size]} loading={active} background={"#fff"} />
                )}
            </div>
        </button>
    );
};

export default CustomButton;
