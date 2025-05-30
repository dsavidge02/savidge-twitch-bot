import { Route, Routes, Navigate } from 'react-router-dom';

import './App.css';

import CreatorWrapper from './creator/components/structures/CreatorWrapper';
import CreatorHome from './creator/components/Home/CreatorHome';
import Register from './creator/components/auth/Register';
import Login from './creator/components/auth/Login';
import Unauthorized from './creator/components/auth/Unauthorized';
import RequireAuth from './creator/components/auth/RequireAuth';
import DenyAuth from './creator/components/auth/DenyAuth';
import TwitchVerify from './creator/components/auth/twitch/TwitchVerify';

import APIAdmin from './creator/components/auth/twitch/APIAdmin/APIAdmin';
import Profile from './creator/components/User/Profile';

import Followers from './creator/components/Followers/Followers';
import Subscribers from './creator/components/Subscribers/Subscribers';

import PersistLogin from './creator/components/auth/PersistLogin';

const App = () => {
    return (
        <div className="app-content">
            <main>
                <Routes>
                    <Route element={<CreatorWrapper />} >
                        <Route element={<PersistLogin />} >
                            <Route index element={<CreatorHome />} />
                            <Route path='followers' element={<Followers />} />
                            <Route path='subscribers' element={<Subscribers />} />

                            <Route element={<DenyAuth />}>
                                <Route path='register' element={<Register />} />
                                <Route path='login' element={<Login />} />
                                <Route path='verify' element={<TwitchVerify />} />
                            </Route>

                            <Route element={<RequireAuth allowedRoles={[1992]} />}>
                                <Route path='profile' element={<Profile />} />
                                <Route path='unauthorized' element={<Unauthorized />} />
                            </Route>

                            <Route element={<RequireAuth allowedRoles={[2002]} />} >
                                <Route path='admin' element={<APIAdmin />} />
                            </Route>
                        </Route>

                        <Route path='*' element={<Navigate to='/' />} />
                    </Route>
                </Routes>
            </main>
        </div>
    );
};

export default App;