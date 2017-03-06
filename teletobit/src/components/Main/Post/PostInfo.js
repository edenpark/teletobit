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
        const { post, user, editable, onDownvote, onUpvote, openLoginModal,
            fromSinglePost, editPost, cancelEditPost, submitUpdatePost } = this.props;

        const { handleDeletePost } = this;

        const userUpvotes = !!user.getIn(['profile', 'upvoted']);
        const isUpvoted = userUpvotes ? !!user.getIn(['profile', 'upvoted', post.get('id')]) : false;
        const creatorIsLoggedIn = user.getIn(['profile', 'uid']) === post.get('creatorUID');

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
                { !fromSinglePost &&
                    <PostCommentsLink post={post} />
                }
                { creatorIsLoggedIn && !editable && fromSinglePost &&
                    <span className="pull-right post-info-item">
                        <span className="creator-option"
                            onClick={editPost}>
                            수정
                        </span>
                        <span className="creator-option"
                                onClick={handleDeletePost}>
                            삭제
                        </span>
                    </span>
                }
                { creatorIsLoggedIn && editable && fromSinglePost &&
                    <span className="pull-right post-info-item">
                        <span className="creator-option"
                            onClick={cancelEditPost}>
                            취소
                        </span>
                        <span className="creator-option" onClick={submitUpdatePost}>
                            저장
                        </span>
                    </span>
                }
            </div>
        );
    }
}

export default PostInfo;

// <span className="post-info-item">{post.get('views')||0}</span>
