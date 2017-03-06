import React, { Component } from 'react';
import PostCreatorLink from 'components/Main/Post/PostCreatorLink';
import PostTimeAgo from 'components/Main/Post/PostTimeAgo';
import PostCommentsLink from 'components/Main/Post/PostCommentsLink';
import Upvote from 'components/Main/Post/Upvote';

import { Icon, Confirm } from 'semantic-ui-react';

class PostInfo extends Component {

    state = {
        open: false
    }

    handleDeleteConfirm = () => {
        this.setState({
            open: true
        })
    }

    handleConfirm = () => {
        this.setState({
            open: false
        })

        const { post, deletePost } = this.props;
        var postObj = {};

        post.forEach((value, key) => {
            postObj[key] = value;
        });

        deletePost(postObj);

    }

    handleCancel = () => {
        this.setState({
            open: false
        })
    }

    render() {
        const { post, user, editable, onDownvote, onUpvote, openLoginModal,
                editPost, cancelEditPost, submitUpdatePost } = this.props;

        const { handleDeleteConfirm, handleConfirm, handleCancel } = this;

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
                { creatorIsLoggedIn && !editable &&
                    <span className="pull-right post-info-item">
                        <span className="creator-option"
                            onClick={editPost}>
                            수정
                        </span>
                        <span className="creator-option"
                                onClick={handleDeleteConfirm}>
                            삭제
                        </span>
                        <Confirm
                            open={this.state.open}
                            content='정말 삭제 하시겠습니까?'
                            cancelButton='취소'
                            confirmButton='확인'
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                        />
                    </span>
                }
                { creatorIsLoggedIn && editable &&
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
