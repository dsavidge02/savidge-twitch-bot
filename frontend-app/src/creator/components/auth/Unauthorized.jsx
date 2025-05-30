import { Link } from 'react-router-dom';

import "./Unauthorized.css";

const Unauthorized = () => {
    return (
        <div className="unauthorized-content">
            <h2>You don't have permission to view this page.</h2>
            <Link to="/" className="creator-link">Home</Link>
        </div>
    )
};

export default Unauthorized;