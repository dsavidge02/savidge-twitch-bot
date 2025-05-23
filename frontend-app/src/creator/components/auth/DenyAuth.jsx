import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const DenyAuth = () => {
    const { isAuth } = useAuthContext();
    const location = useLocation();

    return (
        !isAuth
            ? <Outlet />
            : <Navigate to="/savidge_af" state={{ from: location }} replace />
    );
};

export default DenyAuth;