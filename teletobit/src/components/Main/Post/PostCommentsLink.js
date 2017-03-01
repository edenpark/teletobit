import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'semantic-ui-react';

const PostCommentsLink = ({ post }) => {
    return(
        <span className="post-info-item comment">
            <Link to={ `post/${post.get('id')}` }>
                <Icon name='comment outline' />
                {
                    post.get('commentCount') ?
                    `${post.get('commentCount')} 코멘트 | 코멘트 작성` :
                    `첫 코멘트 남기기`
                }
            </Link>
        </span>
    );
};

export default PostCommentsLink;
