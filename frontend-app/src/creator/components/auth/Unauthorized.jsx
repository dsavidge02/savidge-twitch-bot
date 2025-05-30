import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="unathorized-content">
            <h2>You don't have permission to view this page.</h2>
            <Link to="/" className="creator-link">Home</Link>
        </div>
    )
};

export default Unauthorized;