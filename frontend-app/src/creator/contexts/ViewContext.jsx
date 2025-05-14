import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocation } from 'react-router-dom';

const ViewContext = createContext(null);

export const useViewContext = () => useContext(ViewContext);

const viewParamsReducer = (state, action) => {
    switch(action.type) {
        case 'SET_MODE':
            return { ...state, mode: action.mode };
        case 'SET_DESIGN':
            return { ...state, design: action.design };
        default:
            return state;
    }
};

export const ViewProvider = ({ children }) => {
    const [viewParams, setViewParams] = useReducer(viewParamsReducer, {
        mode: 'default',
        design: 'default'
    });
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        
        const mode = queryParams.get('mode') === 'bot' ? 'bot' : 'default';
        const design = queryParams.get('design') === 'aoe2' ? 'aoe2' : 'default';

        setViewParams({ type: 'SET_MODE', mode });
        setViewParams({ type: 'SET_DESIGN', design });
    }, [location]);

    return (
        <ViewContext.Provider value={{ viewParams }}>
            { children }
        </ViewContext.Provider>
    );
};