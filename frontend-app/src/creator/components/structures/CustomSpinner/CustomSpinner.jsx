import "./CustomSpinner.css";

const CustomSpinner = ({ size, loading, color = "#fff" }) => {
    const { radius, thickness } = size;
    const active = loading ? "loading" : "";
    
    return (
        <div className={ `simple-custom-spinner ${active}` } style={{
            width: `${radius}`,
            height: `${radius}`,
            borderTop: `${thickness} solid ${color}`,
            borderRight: `${thickness} solid transparent`,
        }}>
        </div>
    );
};

export default CustomSpinner;