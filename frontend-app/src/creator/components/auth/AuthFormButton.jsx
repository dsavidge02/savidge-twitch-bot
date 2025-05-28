import './AuthFormButton.css';

const AuthFormButton = ({ onClick, disabled, loading, children }) => {
    return (
        <button 
            className={`auth-form-button ${disabled ? 'disabled' : '' }`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className={`button-text ${loading ? 'fade-out' : 'fade-in'} ${disabled ? 'disabled' : '' }`}>
                {children}
            </span>
        </button>
    );
};

export default AuthFormButton;