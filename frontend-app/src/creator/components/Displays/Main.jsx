import { useState, useEffect, useCallback } from "react";

import "./Main.css";

import { getFollowers, getSubscribers } from "../../api/staticTwitchApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CustomSlider from "../structures/Displays/CustomSlider/CustomSlider";
import useEventSocket from "../../hooks/useEventSocket";

const DISPLAY_INTERVAL = 10 * 1000; //number in seconds

const MainDisplay = () => {
    const [displays, setDisplays] = useState({
        followers: {
            loading: true,
            current: -1,
            goal: 75,
            load: getFollowers,
            resKey: "count",
            title: "Follower Count"
        },
        subscriptions: {
            loading: true,
            current: -1,
            goal: 10,
            load: getSubscribers,
            resKey: "count",
            title: "Subscriber Count"
        }
    });

    const [activeDisplay, setActiveDisplay] = useState("followers")

    const axiosPrivate = useAxiosPrivate();

    const loadDisplay = async (displayName) => {
        const { load, resKey } = displays[displayName];

        try {
            const res = await load(axiosPrivate);
            setDisplays(prev => ({
                ...prev,
                [displayName]: {
                    ...prev[displayName],
                    loading: false,
                    current: res[resKey]
                }
            }));
        }
        catch (err) {
            setDisplays(prev => ({
                ...prev,
                [displayName]: {
                    ...prev[displayName],
                    loading: false,
                    current: -1,
                }
            }));
        }
    }

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedLoadDisplay = useCallback(debounce(loadDisplay, 500), []);

    useEffect(() => {
        const loadAll = async () => {
            await Promise.all(Object.keys(displays).map(loadDisplay));
        };

        loadAll();
    }, []);

    useEffect(() => {
        const displayInterval = setInterval(() => {
            setActiveDisplay(prev => (prev === "followers" ? "subscriptions" : "followers"));
        }, DISPLAY_INTERVAL);

        return () => clearInterval(displayInterval);
    }, []);

    const displayData = displays[activeDisplay];

    const socketEvents = [
        {
            trigger:"followerUpdate",
            action: () => debouncedLoadDisplay("followers")
        },
        {
            trigger: "subscriberUpdate",
            action: () => debouncedLoadDisplay("subscriptions")
        }
    ];

    useEventSocket({ onEvents: socketEvents });

    return (
        <div className="main-display-container">
            <div className="main-display">
                {!displayData.loading && (
                    <CustomSlider
                        key={activeDisplay}
                        title={displayData.title}
                        numerator={displayData.current}
                        denominator={displayData.goal}
                        animation={true}
                    />
                )}
            </div>
        </div>
    );
};

export default MainDisplay;