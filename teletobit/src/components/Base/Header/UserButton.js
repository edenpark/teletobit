import React from 'react';

const UserButton = ({ thumbnail, onShow }) => {
    return(
        <div className="user-button" onClick={onShow}>
            <div className="thumbnail" style={{backgroundImage: `url(${thumbnail})`}}></div>
        </div>
    );
};

export default UserButton;
