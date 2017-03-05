import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'semantic-ui-react';

const PostCommentsLink = ({ post }) => {
    return(
        <span className="post-info-item comment">
            <Link to={ `post/${post.get('id')}` }>
                <Icon name='comment outline'
                    size="large"/>
                {
                    post.get('commentCount') &&
                    `${post.get('commentCount')}`
                }
            </Link>
        </span>
    );
};

export default PostCommentsLink;
