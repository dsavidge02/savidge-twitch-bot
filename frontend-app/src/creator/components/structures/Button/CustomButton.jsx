import './CustomButton.css';

const CustomButton = ({ action, disabled, active, text }) => {

    const size = "medium";
    const isDisabled = active ? active : disabled;
    const style = active ? "active" : disabled ? "disabled" : ""

    return (
        <button
            onClick={action}
            disabled={isDisabled}
        >
            <div className={`custom-button-container ${size} ${style}`}>
                {/* <span>{`${isDisabled ? "disabled" : "enabled"}`}</span>
                <span>{`${active ? "active" : "inactive"}`}</span> */}
                <span className={`custom-button-content ${size} ${style}`}>{text}</span>
            </div>
        </button>
    );
};

export default CustomButton;

/*

GOAL IS FOR:
disabled - to be disabled or enabled
loading - to be inactive or active


boolean logic:
if active -> disabled




*/