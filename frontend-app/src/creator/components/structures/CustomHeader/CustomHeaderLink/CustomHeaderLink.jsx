import { Link } from "react-router-dom";
import "./CustomHeaderLink.css";

const CustomHeaderLink = ({ linkName, image, redirect = "/", action }) => {
    const handleClick = async (e) => {
        if (action) {
            e.preventDefault();
            await action();
        }
    }

    return (
        <Link className="custom-header-link-container" to={redirect} onClick={handleClick}>
            {image && (<img className="custom-header-link-logo" src={image} alt={linkName} />)}
            <span className="custom-header-link-name">{linkName}</span>
        </Link>
    );
};

export default CustomHeaderLink;