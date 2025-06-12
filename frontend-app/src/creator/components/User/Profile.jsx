import { useState, useEffect } from "react";

import { useAuthContext } from "../../contexts/AuthContext";
import { checkFollowing, checkSubscriptions } from "../../api/staticTwitchApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import "./Profile.css";

import CustomAsyncValueDisplay from "../structures/CustomValueDisplay/CustomAsyncValueDisplay";

const Profile = () => {
    const { getUsername, getRoles, getTwitchUserId } = useAuthContext();

    const username = getUsername();
    const roles = getRoles();
    const twitch_user_id = getTwitchUserId();
    
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const [userInfo, setUserInfo] = useState({});
    const [subscriptionInfo, setSubscriptionInfo] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const follower = await checkFollowing(axiosPrivate);
                setUserInfo(
                    follower
                );

                const subscriptions = await checkSubscriptions(axiosPrivate);
                setSubscriptionInfo(
                    subscriptions
                );
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
                <CustomAsyncValueDisplay
                    label={"Name"}
                    value={username}
                    confidential={false}
                />
                {
                    Array.isArray(roles) &&
                    roles.length > 0 &&
                    roles.map((r, i) => (
                        <CustomAsyncValueDisplay
                            key={i}
                            label={"Role"}
                            value={r}
                            confidential={false}
                        />
                    ))
                }
                <CustomAsyncValueDisplay
                    label={"Twitch User Id"}
                    value={twitch_user_id}
                    confidential={false}
                />
            </div>
            <div className="profile-attributes-container">
                {
                    <CustomAsyncValueDisplay
                        label={"Following"}
                        value={`${userInfo.hasOwnProperty("user_name")}`}
                        confidential={false}
                    />
                }
                {
                    <CustomAsyncValueDisplay
                        label={"Subscription"}
                        value={`${subscriptionInfo?.length > 0}`}
                        confidential={false}
                    />
                }
            </div>
        </div>
    );
};

export default Profile;