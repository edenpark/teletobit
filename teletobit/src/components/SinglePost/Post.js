import React, { Component } from 'react';
import PostInfo from 'components/Main/Post/PostInfo';
import PostLink from './PostLink';
import CommentForm from './CommentForm';
import CommentEle from './CommentEle';

import {
    Header,
    TextArea,
    Message
} from 'semantic-ui-react';


class Post extends Component {

    render() {
        const { user, post, message, editable, comments, upvote, downvote,
                deletePost, commentForm, upvoteComment, downvoteComment,
                openLoginModal, addComment, deleteComment, updateComment,
                handleEditPost, changeCommentForm, submitUpdatePost,
                updatePost } = this.props;

        let commentEles = comments.map(comment => (
            <CommentEle comment={comment}
                        user={user}
                        key={comment.get('id')}
                        onUpvote={upvoteComment}
                        onDownvote={downvoteComment}
                        openLoginModal={openLoginModal}
                        deleteComment={deleteComment}
                        updateComment={updateComment}
            />
        ))

        return(
            <div className="post-wrapper single">
                { post.get('note') && editable &&
                    <div className="post-note">
                        <TextArea
                            value={post.get('note')}
                            autoHeight
                            onChange={(e) => updatePost.note(e.target.value)}
                        />
                    </div>
                }
                { post.get('note') && !editable &&
                    <div className="post-note">
                        { post.get('note') }
                    </div>
                }
                <PostLink
                    post={ post }
                    editable={editable}
                    updatePost={updatePost}
                    />
                {
                    message && (
                        <Message color="red" size="mini">
                            { message }
                        </Message>
                    )
                }
                <PostInfo
                    post={ post }
                    user={user}
                    onUpvote={upvote}
                    editable={editable}
                    onDownvote={downvote}
                    editPost={handleEditPost.edit}
                    cancelEditPost={handleEditPost.cancel}
                    submitUpdatePost={submitUpdatePost}
                    deletePost={deletePost}
                    openLoginModal={openLoginModal}
                    fromSinglePost={true}
                    />
                <div className="comment-container">
                    <Header as='h3' dividing>
                        {comments.size || 0} 코멘트
                    </Header>
                    <CommentForm
                        user={user}
                        post={post}
                        commentForm={commentForm}
                        addComment={addComment}
                        openLoginModal={openLoginModal}
                        changeCommentForm={changeCommentForm}
                        />
                    { commentEles }
                </div>
            </div>
        );
    }
}

export default Post;
