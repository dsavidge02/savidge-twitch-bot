import { useState, useEffect } from "react";

import { useAuthContext } from "../../contexts/AuthContext";
import { checkFollowing, checkSubscribed } from "../../api/staticTwitchApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import "./Profile.css";

import CustomAsyncValueDisplay from "../structures/CustomValueDisplay/CustomAsyncValueDisplay";

const Profile = () => {
    const { getUsername, getRoles } = useAuthContext();

    const username = getUsername();
    const roles = getRoles();
    
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await checkFollowing(axiosPrivate);
                console.log(res);
                setUserInfo({
                    ...res
                });
            }
            catch (err) {
                console.error("Error loading data:", err);
            }
            finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header-content">

            </div>
            <div className="profile-attributes-container">
                {

                }
            </div>
        </div>
    );
};

export default Profile;