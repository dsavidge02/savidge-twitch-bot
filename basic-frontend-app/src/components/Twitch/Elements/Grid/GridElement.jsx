import './GridElement.css';

const GridElement = ({ props }) => {
    const { val, width, height, border } = props;

    let className = 'grid-element';
    if (val === 0) {
        className += ' red';
    }
    else if (val === 1) {
        className += ' green';
    }
    else {
        className += ' yellow';
    }

    const size = Math.min(width, height);
    const style = {
        width: `${size}px`,
        height: `${size}px`,
        border: `${border}px solid gray`
    };

    return (
        <div className={className} style={style}></div>
    )
}

export default GridElement;