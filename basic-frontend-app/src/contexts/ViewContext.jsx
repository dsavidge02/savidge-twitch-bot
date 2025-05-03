import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, Navigate } from 'react-router-dom';

const ViewContext = createContext(null);

export const useViewContext = () => useContext(ViewContext);

export const ViewProvider = ({ children }) => {
    const [viewMode, setViewMode] = useState('default');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const mode = queryParams.get('mode');
        if (mode === 'bot') {
            setViewMode(mode);
        }
        else {
            setViewMode('default');
        }
        
    }, [location]);

    return (
        <ViewContext.Provider value={{ viewMode }}>
            { children }
        </ViewContext.Provider>
    )
};

