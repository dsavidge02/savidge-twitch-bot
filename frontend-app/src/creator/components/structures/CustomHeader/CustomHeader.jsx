import CustomHeaderLink from "./CustomHeaderLink/CustomHeaderLink";

import "./CustomHeader.css"

const CustomHeader = ({ allLinks, userRoles }) => {
    if (allLinks.length === 0) return null;

    const [leftLink, ...tempLinks] = allLinks;
    const rightLinks = tempLinks.filter(l => {
        if (!l.hasOwnProperty("roles")) return true;
        if (userRoles.length === 0 && l.roles.length === 0 ) return true;
        return l.roles.some(role => userRoles.includes(role));
    });

    return (
        <div className="custom-header-container">
            <CustomHeaderLink 
                linkName={leftLink.linkName} 
                image={leftLink.image} 
                redirect={leftLink.redirect} 
            />
            <div className="custom-header-spacer" />
            <div className="custom-header-menu-links">
                {
                    rightLinks.map((rightLink, i) => (
                        <CustomHeaderLink
                            key={i}
                            linkName={rightLink.linkName}
                            image={rightLink.image}
                            redirect={rightLink.redirect}
                            action={rightLink.action}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default CustomHeader;