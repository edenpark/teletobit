import React from 'react';

const Header  = ({children}) => {
    return (
        <div>
            <div className="header-wrapper">
                <div className="header">
                    { children }
                </div>
                <div className="header-spacer">
                </div>
            </div>
        </div>
    )
}

// re-export child components
export { default as BrandLogo } from './BrandLogo';
export { default as AuthButton } from './AuthButton';
export { default as UserButton } from './UserButton';
export { default as UserMenu } from './UserMenu';

export default Header;
