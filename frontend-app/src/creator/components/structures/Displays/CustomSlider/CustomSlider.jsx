import "./CustomSlider.css";

const CustomSlider = ({ title, numerator, denominator, animation }) => {
    const percentage = Math.min((numerator / denominator), 1);
    const sliderText = `${numerator}`;

    const getColor = (pct) => {
        const r = Math.round(255 * (1 - pct));
        const g = Math.round(255 * pct);
        return `rgb(${r}, ${g}, 0)`;
    };

    return (
        <div className={`custom-slider-container ${ animation ? "animate" : "" }`}>
            <div className="custom-slider-title">
                {title}
            </div>
            <div className="custom-slider-inner-container">
                <div
                    key={numerator}
                    className={`custom-slider-fill ${ animation ? "animate" : "" }`}
                    style={{
                        width: `${percentage * 100}%`,
                        backgroundColor: getColor(percentage)
                    }}
                >
                    <div className={`custom-slider-text`}>
                        {sliderText}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CustomSlider;