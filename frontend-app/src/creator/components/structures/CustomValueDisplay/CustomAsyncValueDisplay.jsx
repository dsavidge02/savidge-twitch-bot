import { useState, useEffect } from "react";
import useRefreshToken from "../../../hooks/useRefreshToken";

import CustomButton from "../CustomButton/CustomButton";

import "./CustomValueDisplay.css";

const CustomAsyncValueDisplay = ({ label, value, confidential, maxLength = 10, type = "string" }) => {
    const refresh = useRefreshToken();
    const [isHidden, setIsHidden] = useState(confidential);

    const handleView = async (e) => {
        if (isHidden) {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsHidden(false);
            }
        }
        else {
            setIsHidden(true);
        }
    };

    const placeholder = "*".repeat(maxLength);

    const renderValue = () => {
        if (type === "string") {
            return value;
        }
        else if (type === "date"){
            const localTimeString = new Date(value).toLocaleString();
            return localTimeString;
        }
    };

    return (
        <div className="custom-value-display-container">
            <span className="custom-value-label">{ label }</span>
            <span className="custom-value-content">
                <div className="custom-value-display">
                    {
                        isHidden ? placeholder : renderValue()
                    }
                </div>
                <div className="custom-value-button-container">
                    {
                        confidential && (
                            <CustomButton
                                action={handleView}
                                disabled={false}
                                active={false}
                                text={"View Secret"}
                                size={"small"}
                            />
                        )
                    }
            </div>
            </span>
        </div>
    );
};

export default CustomAsyncValueDisplay;