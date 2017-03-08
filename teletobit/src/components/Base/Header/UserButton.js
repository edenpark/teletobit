import React from 'react';

const UserButton = ({ thumbnail, onShow }) => {
    return(
        <div className="user-button" onClick={onShow}>
            <div className="thumbnail" style={{backgroundImage: `${thumbnail ? url(${thumbnail}): url('/user_thumb.jpg')}` }}></div>
        </div>
    );
};

export default UserButton;
