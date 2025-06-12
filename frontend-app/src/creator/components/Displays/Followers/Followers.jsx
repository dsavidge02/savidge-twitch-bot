import { useState, useEffect } from "react";

import { getFollowers } from "../../../api/staticTwitchApi";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useEventSocket from "../../../hooks/useEventSocket";

import "./Followers.css";

import CustomSlider from "../../structures/Displays/CustomSlider/CustomSlider";

const FollowersDisplay = () => {
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getFollowers(axiosPrivate);
                setFollowerCount(res.count);
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

    const updateFollowerCount = (follower) => {
        console.log(follower);
        setFollowerCount(followerCount + 1);
    };

    useEventSocket({ onFollower: updateFollowerCount });

    return (
        <div className="followers-display-container">
            <CustomSlider 
                title={"Number of Followers"}
                numerator={followerCount}
                denominator={75}
            />
        </div>
    )

};

export default FollowersDisplay;