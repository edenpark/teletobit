import React, { Component } from 'react';
import PostCreatorLink from './PostCreatorLink';
import PostTimeAgo from './PostTimeAgo';
import PostCommentsLink from './PostCommentsLink';
import Upvote from './Upvote';

import { Icon } from 'semantic-ui-react';

class PostInfo extends Component {
    handleDeletePost = () => {
        const { post, deletePost } = this.props;
        var postObj = {};

        post.forEach((value, key) => {
            postObj[key] = value;
        });

        deletePost(postObj);
    }


    render() {
        const { post, user, onDownvote, onUpvote, openLoginModal,
            hidePostCommentLink } = this.props;

        const { handleDeletePost } = this;

        const userUpvotes = !!user.getIn(['profile', 'upvoted']);
        const isUpvoted = userUpvotes ? !!user.getIn(['profile', 'upvoted', post.get('id')]) : false;
        const creatorIsLoggedIn = user.getIn(['profile', 'uid']) === post.get('creatorUID');

        const deleteOption = user.getIn(['profile', 'uid']) === post.get('creatorUID')
                            && (
                                <span className="delete">
                                    <Icon name='close' onClick={handleDeletePost}/>
                                </span>
                            );

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
                <span className="post-info-item">·</span>
                <span className="post-info-item">{post.get('views')||0}</span>
                { !hidePostCommentLink &&
                    <PostCommentsLink post={post} />
                }
                { deleteOption }
            </div>
        );
    }
}

export default PostInfo;
