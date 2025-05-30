import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const DenyAuth = () => {
    const { getId, getRoles } = useAuthContext();
    const location = useLocation();

    const id = getId();
    const roles = getRoles();

    console.log(`id: ${id}`);
    console.log(`roles: ${roles}`);

    return (
        !id
            ? <Outlet />
            : <Navigate to="/savidge_af/profile" />
    );
};

export default DenyAuth;