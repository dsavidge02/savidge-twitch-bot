import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import App from './App';
import Home from './components/Home/Home';
import CreatorWrapper from './creator/components/structures/CreatorWrapper';
import CreatorHome from './creator/components/Home/CreatorHome';
import Register from './creator/components/auth/Register';
import Login from './creator/components/auth/Login';
import Unauthorized from './creator/components/auth/Unauthorized';
import CreatorUsers from './creator/components/Users/CreatorUsers';
import CreatorUsersAlt from './creator/components/Users/CreatorUsersAlt';
import RequireAuth from './creator/components/auth/RequireAuth';
import DenyAuth from './creator/components/auth/DenyAuth';
import TwitchVerify from './creator/components/auth/twitch/TwitchVerify';
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

                                <Route element={<DenyAuth />}>
                                    <Route path='register' element={<Register />} />
                                    <Route path='login' element={<Login />} />
                                    <Route path='verify' element={<TwitchVerify />} />
                                </Route>

                                <Route element={<RequireAuth allowedRoles={[1992]} />}>
                                    <Route path='unauthorized' element={<Unauthorized />} />
                                </Route>

                                <Route element={<RequireAuth allowedRoles={[2002]} />} >
                                    <Route path='users' element={<CreatorUsers />} />
                                    <Route path='alt' element={<CreatorUsersAlt />} />
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