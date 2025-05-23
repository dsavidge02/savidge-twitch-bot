import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
    const { id, roles } = useAuthContext();
    const location = useLocation();

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : id
                ? <Navigate to="/savidge_af/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/savidge_af/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;