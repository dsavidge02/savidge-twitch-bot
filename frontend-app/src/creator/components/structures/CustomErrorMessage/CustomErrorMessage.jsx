import "./CustomErrorMessage.css";

const CustomErrorMessage = ({ status, text, size }) => {
    const visible = status ? "visible" : "";
    return (
        <div className={ `custom-error-message-container ${visible}` }>
            <span className="custom-error-message" style={{
                fontSize: `${size}`
            }}>
                {`ERROR: ${text}`}
            </span>
        </div>
    );
};

export default CustomErrorMessage;