import { Outlet, redirect } from 'react-router-dom';
import { useViewContext } from '../../contexts/ViewContext';

import './CreatorWrapper.css';

import CustomHeader from './CustomHeader/CustomHeader';
import CustomFooter from './CustomFooter/CustomFooter';
import mindMeleeLogo from "../../../assets/images/mind_melee_logo_transparent.png";
import { useAuthContext } from '../../contexts/AuthContext';

const CreatorWrapper = () => {
    const { viewParams } = useViewContext();
    const { doLogout, getRoles } = useAuthContext();

    const allLinks = [
        {
            linkName: "Savidge Apps",
            image: mindMeleeLogo,
            redirect: "/",
            roles: []
        },
        {
            linkName: "Display",
            image: null,
            redirect: "/display",
        },
        {
            linkName: "Followers",
            image: null,
            redirect: "/followers",
        },
        {
            linkName: "Subscribers",
            image: null,
            redirect: "/subscribers",
        },
        {
            linkName: "Login",
            image: null,
            redirect: "/login",
            roles: []
        },
        {
            linkName: "Register",
            image: null,
            redirect: "/register",
            roles: []
        },
        {
            linkName: "Admin",
            image: null,
            redirect: "/admin",
            roles: [2002],
        },
        {
            linkName: "Profile",
            image: null,
            redirect: "/profile",
            roles: [1992],
        },
        {
            linkName: "Logout",
            image: null,
            redirect: "/login",
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
                    <div className={`creator-wrapper-content ${viewParams.design}`}>
                        <Outlet/>
                    </div>
                </div>
                {
                    viewParams.mode === 'default' && (
                        <div className="creator-wrapper-footer">
                            <CustomFooter />
                        </div>
                    ) 
                }
            </div>
        </div>
    );
};

export default CreatorWrapper;