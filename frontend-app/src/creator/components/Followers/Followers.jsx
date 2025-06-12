import { useState, useEffect } from "react";

import { getFollowers } from "../../api/staticTwitchApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import "./Followers.css";

import CustomAsyncValueDisplay from "../structures/CustomValueDisplay/CustomAsyncValueDisplay";

const Followers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const [followerInfo, setFollowerInfo] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getFollowers(axiosPrivate);
                setFollowerInfo({
                    count: res.count,
                    followers: res.followers
                })
            }
            catch (err) {
                console.error("Error loading data:", err);
            }
            finally {
                setIsLoading(false);
            }
        };


        loadData();
    }, []);

    return (
        <div className="followers-container">
            <div className="followers-header-container">
                Number of followers: {followerInfo.count}
            </div>
            <div className="followers-list-container">
                { 
                    !isLoading &&
                    Array.isArray(followerInfo.followers) && 
                    followerInfo?.followers.length > 0 &&
                    followerInfo.followers.map((follower, i) => (
                        <CustomAsyncValueDisplay
                            key={i}
                            label={"Name"}
                            value={follower.user_name}
                            confidential={false}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Followers;