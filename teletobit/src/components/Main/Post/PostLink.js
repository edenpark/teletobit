import React from 'react';
import decode from 'ent/decode';
import { Link } from 'react-router';

const PostLink = ({ post }) => {
    return(
        <Link to={`/post/${post.get('id')}`}>
            <div className="post-link-wrapper">
                <div className="post-title">
                    {decode(post.get('title'))}
                </div>
                <span className="post-source">
                    { post.get('source') }
                </span>
            </div>
        </Link>
    );
};

export default PostLink;

// <a href={`//${post.get('source')}`}>{ post.get('source') }</a>
