import { Outlet } from "react-router-dom";
import { useState, useEffect} from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useAuthContext } from "../../contexts/AuthContext";

import CustomSpinner from "../structures/CustomSpinner/CustomSpinner";

const sleep = (sec) => new Promise(resolve => setTimeout(resolve, sec * 1000));

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuthContext();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);
    
    return (
        <>
            {
                isLoading
                    ? <div className="loading-page-container"><CustomSpinner size={{ radius: "100px", thickness: "5px" }} loading={isLoading} color={"#1a53ff"}/></div>
                    : <Outlet />
            }
        </>
    );
};

export default PersistLogin;