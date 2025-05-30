import { useState, useEffect } from "react";

import { getSubscribers } from "../../api/staticTwitchApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import "./Subscribers.css";

import CustomAsyncValueDisplay from "../structures/CustomValueDisplay/CustomAsyncValueDisplay";

const Subscribers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const [subscriberInfo, setSubscriberInfo] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getSubscribers(axiosPrivate);
                setSubscriberInfo({
                    count: res.count,
                    subscribers: res.subscribers
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


    console.log(subscriberInfo.subscribers);

    return (
        <div className="subscribers-container">
            <div className="subscribers-header-container">
                Number of subscribers: {subscriberInfo.count}
            </div>
            <div className="subscribers-list-container">
                { 
                    !isLoading &&
                    Array.isArray(subscriberInfo.subscribers) && 
                    subscriberInfo?.subscribers.length > 0 &&
                    subscriberInfo.subscribers.map((subscriber, i) => (
                        <CustomAsyncValueDisplay
                            key={i}
                            label={"Name"}
                            value={subscriber.user_name}
                            confidential={false}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Subscribers;