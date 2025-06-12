import { useState, useEffect } from "react";

import { getSubscribers } from "../../../api/staticTwitchApi";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useEventSocket from "../../../hooks/useEventSocket";

import "./Subscribers.css";

import CustomSlider from "../../structures/Displays/CustomSlider/CustomSlider";

const SubscribersDisplay = () => {
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const [subscriptionCount, setSubscriptionCount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getSubscribers(axiosPrivate);
                setSubscriptionCount(res.count);
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

    const updateSubscriberCount = (subscription) => {
        console.log(subscription);
        setSubscriptionCount(subscriptionCount + 1);
    };

    return (
        <div className="subscribers-display-container">
            <CustomSlider 
                title={"Number of Subscribers"}
                numerator={subscriptionCount}
                denominator={10}
            />
        </div>
    )

};

export default SubscribersDisplay;