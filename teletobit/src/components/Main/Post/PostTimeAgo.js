import React from 'react';
import timeAgo from 'util/timeAgo';

const PostTimeAgo = ({ time }) => {
    return(
        <span className="post-info-item time">
            { timeAgo(time) }
        </span>

    );
};

export default PostTimeAgo;
