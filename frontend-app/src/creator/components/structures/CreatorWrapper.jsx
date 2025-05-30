import { Outlet, redirect } from 'react-router-dom';
import { useViewContext } from '../../contexts/ViewContext';

import './CreatorWrapper.css';

import CustomHeader from './CustomHeader/CustomHeader';
import mindMeleeLogo from "../../../assets/images/mind_melee_logo_transparent.png";
import { useAuthContext } from '../../contexts/AuthContext';

const CreatorWrapper = () => {
    const { viewParams } = useViewContext();
    const { doLogout, getRoles } = useAuthContext();

    const allLinks = [
        {
            linkName: "Savidge Apps",
            image: mindMeleeLogo,
            redirect: "/savidge_af",
            roles: []
        },
        {
            linkName: "Followers",
            image: null,
            redirect: "/savidge_af/followers",
        },
        {
            linkName: "Subscribers",
            image: null,
            redirect: "/savidge_af/subscribers",
        },
        {
            linkName: "Login",
            image: null,
            redirect: "/savidge_af/login",
            roles: []
        },
        {
            linkName: "Register",
            image: null,
            redirect: "/savidge_af/register",
            roles: []
        },
        {
            linkName: "Admin",
            image: null,
            redirect: "/savidge_af/admin",
            roles: [2002],
        },
        {
            linkName: "Profile",
            image: null,
            redirect: "/savidge_af/profile",
            roles: [1992],
        },
        {
            linkName: "Logout",
            image: null,
            redirect: "/savidge_af/login",
            roles: [1992],
            action: doLogout
        },
    ]

    const roles = getRoles()

    return (
        <div className="creator-wrapper">
            {
                viewParams.mode === 'default' && (
                    <div className="creator-wrapper-header">
                        <CustomHeader allLinks={allLinks} userRoles={roles}/>
                    </div>
                )
            }
            <div className="creator-wrapper-scrollable-container">
                <div className={ `creator-wrapper-content-border ${viewParams.mode === 'default' ? '' : `includes--border ${viewParams.design}`}` }>
                    <div className="creator-wrapper-content">
                        <Outlet/>
                    </div>
                </div>
                {
                    viewParams.mode === 'default' && (
                        <div className="creator-wrapper-footer">
                            <p>FOOTER</p>
                        </div>
                    ) 
                }
            </div>
        </div>
    );
};

export default CreatorWrapper;