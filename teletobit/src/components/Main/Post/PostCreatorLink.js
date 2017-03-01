import React from 'react';
import { Link } from 'react-router';

const PostCreatorLink = ({ creator }) => {
    return(
        <span className="post-info-item creator">
            <Link to={`/profile/${creator}`}>
                <b>{ `@${creator}` }</b>
            </Link>님이 공유
        </span>
    );
};

export default PostCreatorLink;
