import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import App from './App';

import { ViewProvider } from './creator/contexts/ViewContext';
import { AuthProvider } from './creator/contexts/AuthContext';

function Router() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ViewProvider>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </ViewProvider>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default Router;