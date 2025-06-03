import { useState, useEffect, useCallback } from "react";

import "./Main.css";

import { getFollowers, getSubscribers } from "../../api/staticTwitchApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CustomSlider from "../structures/Displays/CustomSlider/CustomSlider";
import useEventSocket from "../../hooks/useEventSocket";

const DISPLAY_INTERVAL = 5 * 1000; //number in seconds

const MainDisplay = () => {
    const [displays, setDisplays] = useState({
        followers: {
            loading: true,
            current: -1,
            goal: 75,
            load: getFollowers,
            resKey: "count"
        },
        subscriptions: {
            loading: true,
            current: -1,
            goal: 10,
            load: getSubscribers,
            resKey: "count"
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

    const updateDisplay = useCallback((displayName) => {

        setDisplays(prev => ({
            ...prev,
            [displayName]: {
                ...prev[displayName],
                current: prev[displayName].current + 1
            }
        }));
    }, []);

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
            action: () => updateDisplay("followers")
        },
        {
            trigger: "subscriberUpdate",
            action: () => updateDisplay("subscriptions")
        }
    ];

    useEventSocket({ onEvents: socketEvents });

    return (
        <div className="main-display-container">
            {!displayData.loading && (
                <CustomSlider
                    title={`Number of ${activeDisplay}`}
                    numerator={displayData.current}
                    denominator={displayData.goal}
                />
            )}
        </div>
    );
};

export default MainDisplay;