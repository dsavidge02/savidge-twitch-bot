import "./CustomSlider.css";

const CustomSlider = ({title, numerator, denominator}) => {
    const percentage = Math.min((numerator / denominator), 1);
    const sliderText = `${numerator}`;

    const getColor = (pct) => {
        const r = Math.round(255 * (1 - pct));
        const g = Math.round(255 * pct);
        return `rgb(${r}, ${g}, 0)`;
    };

    return (
        <div className="custom-slider-container">
            <div className="custom-slider-title">
                {title}
            </div>
            <div className="custom-slider-inner-container">
                <div className="custom-slider-fill"
                    style={{
                        width: `${percentage * 100}%`,
                        backgroundColor: getColor(percentage)
                    }}
                >
                    <div className="custom-slider-text">
                        {sliderText}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CustomSlider;