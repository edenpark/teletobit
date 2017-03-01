import React from 'react';

const UserButton = ({thumbnail, onClick}) => {
    return(
        <div className="user-button" onClick={onClick}>
            <div className="thumbnail" style={{backgroundImage: `url(${thumbnail})`}}></div>
        </div>
    );
};

export default UserButton;
