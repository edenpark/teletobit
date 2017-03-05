import React from 'react';
import { Icon } from 'semantic-ui-react';

const AuthButton = ({onClick}) => {
    return(
        <div className="auth-button-wrapper">
            <div className="auth-button" onClick={onClick}>
                <Icon name="user"
                    fitted
                    size="large"
                />
                <span>로그인/회원가입</span>
            </div>
        </div>
    );
};

export default AuthButton;
