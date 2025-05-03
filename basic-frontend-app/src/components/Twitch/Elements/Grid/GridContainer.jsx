import { useState, useEffect, useRef } from 'react';
import './GridContainer.css';
import GridElement from './GridElement';

const GridContainer = ({ props }) => {
    const { data, rows, cols, start = 0 } = props;
    const containerRef = useRef(null);
    const [elemSize, setElemSize] = useState({ width: 0, height: 0, gap: 0, border: 0 });


    const calculateElemSize = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            const containerScale = Math.min(containerWidth, containerHeight);

            const elemGap = containerScale / 10;
            const elemBorder = containerScale / 20;
            
            const totalGapX = (cols - 1) * elemGap;
            const availableWidth = containerWidth - totalGapX;
            const elemWidth = availableWidth / cols;

            const totalGapY = (rows - 1) * elemGap;
            const availableHeight = containerHeight - totalGapY;
            const elemHeight = availableHeight / rows;
            
            setElemSize({ width: elemWidth, height: elemHeight, gap: elemGap, border: elemBorder });
        }
    };

    useEffect(() => {
        calculateElemSize();
        window.addEventListener('resize', calculateElemSize);
        return () => window.removeEventListener('resize', calculateElemSize);
    }, [rows, cols]);

    const getGrid = () => {
        let k = 0;
        const gridRows = [];
        for (let i = 0; i < rows; i++) {
            const rowElements = [];
            for (let j = 0; j < cols; j++) {
                const gridInd = i * cols + j;
                if (start <= gridInd && k < data.length) {
                    const props = {
                        val: data[k],
                        width: elemSize.width,
                        height: elemSize.height,
                        gap: elemSize.gap,
                        border: elemSize.border
                    };
                    rowElements.push(
                        <GridElement key = {gridInd} props={props} />
                    );
                    k++;
                }
                else {
                    const props = {
                        val: 2,
                        width: elemSize.width,
                        height: elemSize.height,
                        gap: elemSize.gap,
                        border: elemSize.border
                    };
                    rowElements.push(
                        <GridElement key = {gridInd} props={props} />
                    )
                }
            }
            const style = {
                gap: `${elemSize.gap}px`
            }
            gridRows.push(
                <div key = {i} className="grid-row" style={style}>
                    {rowElements}
                </div>
            );
        }
        return gridRows;
    };

    const style = {
        gap: `${elemSize.gap}px`
    };
    return (
        <div ref={containerRef} className="grid-container" style={style}>
            {getGrid()}
        </div>
    );
}

export default GridContainer;