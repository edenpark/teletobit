import React, { Component } from 'react';
import PostCreatorLink from './PostCreatorLink';
import PostTimeAgo from './PostTimeAgo';
import PostCommentsLink from './PostCommentsLink';
import Upvote from './Upvote';

class PostInfo extends Component {

    render() {
        const { post, user, onDownvote, onUpvote, openLoginModal } = this.props;

        const userUpvotes = !!user.getIn(['profile', 'upvoted']);
        const isUpvoted = userUpvotes ? !!user.getIn(['profile', 'upvoted', post.get('id')]) : false;

        return(
            <div className="post-info-wrapper">
                <Upvote
                    user={user}
                    itemId={post.get('id')}
                    isUpvoted={isUpvoted}
                    upvotes={post.get('upvotes') || 0}
                    onUpvote={onUpvote}
                    onDownvote={onDownvote}
                    openLoginModal={openLoginModal}
                />
                <PostCreatorLink creator={ post.get('creator') } />
                <span className="post-info-item">·</span>
                <PostTimeAgo time={post.get('time')} />
                <PostCommentsLink post={post} />
            </div>
        );
    }
}

export default PostInfo;
