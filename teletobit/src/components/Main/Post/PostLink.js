import React from 'react';
import decode from 'ent/decode';
import { Link } from 'react-router';

const PostLink = ({ post }) => {
    return(
        <div className="post-link-wrapper">
            <Link to={`/post/${post.get('id')}`}>
                <div className="post-title">
                    {decode(post.get('title'))}
                </div>
                <div className="post-source">
                    { post.get('source') }
                </div>
            </Link>
        </div>
    );
};

export default PostLink;
