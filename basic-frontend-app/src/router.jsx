import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import App from './App';
import Home from './components/Home/Home';
import TwitchWrapper from './components/Twitch/TwitchWrapper';
import TwitchHome from './components/Twitch/Home/Home';
import MainDisplay from './components/Twitch/Displays/Main/Main';

import { ViewProvider } from './contexts/ViewContext';

function Router() {
    return (
        <BrowserRouter>
            <ViewProvider>
                <Routes>
                    <Route path="/index.html" element = {<Navigate to='/' />} />
                    <Route path="/" element={<App />} >
                        <Route index element={<Home />} />
                        <Route path="twitch" element={<TwitchWrapper />} >
                            <Route index element={<TwitchHome />} />
                            <Route path="main" element={<MainDisplay />} />
                            <Route path='*' element={<Navigate to='/twitch' />} />
                        </Route>
                        <Route path='*' element={<Navigate to='/' />} />
                    </Route>
                </Routes>
            </ViewProvider>
        </BrowserRouter>
    )
};

export default Router;