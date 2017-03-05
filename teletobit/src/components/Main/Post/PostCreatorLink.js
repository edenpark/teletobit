import React from 'react';
import { Link } from 'react-router';

const PostCreatorLink = ({ creator }) => {
    return(
        <span className="post-info-item creator">
            <Link to={`/profile/${creator}`}>
                { `@${creator}` }
            </Link>
        </span>
    );
};

export default PostCreatorLink;
