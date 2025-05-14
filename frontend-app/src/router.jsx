import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import App from './App';
import Home from './components/Home/Home';
import CreatorWrapper from './creator/components/structures/CreatorWrapper';
import CreatorHome from './creator/components/Home/CreatorHome';
import Register from './creator/components/auth/Register';
import Login from './creator/components/auth/Login';
import CreatorUsers from './creator/components/Users/CreatorUsers';
import RequireAuth from './creator/components/auth/RequireAuth';

import { ViewProvider } from './creator/contexts/ViewContext';
import { AuthProvider } from './creator/contexts/AuthContext';

function Router() {
    return (
        <BrowserRouter>
            <ViewProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/index.html" element = {<Navigate to='/' />} />
                        <Route path="/" element={<App />} >
                            <Route index element={<Home />} />
                            <Route path="savidge_af" element={<CreatorWrapper />} >
                                <Route index element={<CreatorHome />} />
                                <Route path='register' element={<Register />} />
                                <Route path='login' element={<Login />} />

                                <Route element={<RequireAuth allowedRoles={[2002]}/>} >
                                    <Route path='users' element={<CreatorUsers />} />
                                </Route>

                                <Route path='*' element={<Navigate to='/savidge_af' />} />
                            </Route>
                            <Route path='*' element={<Navigate to='/' />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </ViewProvider>
        </BrowserRouter>
    )
}

export default Router;