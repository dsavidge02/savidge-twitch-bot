import "./CustomFooter.css";

const CustomFooter = () => {
    return (
        <div className="custom-footer-container">
            <div className="custom-footer-block">
                <h4>Connect:</h4>
                <span className="custom-footer-media-link">Twitch</span>
            </div>
            <div className="custom-footer-block">
                <h4>Contact:</h4>
                <span className="custom-footer-contact-link">Email</span>
            </div>
        </div>
    );
};

export default CustomFooter;