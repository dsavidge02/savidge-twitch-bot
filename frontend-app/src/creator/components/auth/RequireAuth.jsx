import { jwtDecode } from "jwt-decode";

import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuthContext();
    const location = useLocation();

    const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined

    const roles = decoded?.UserInfo?.roles || [];

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?._id
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/savidge_af/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;