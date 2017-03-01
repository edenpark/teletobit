import React, { Component } from 'react';
import PostInfo from 'components/Main/Post/PostInfo';
import PostLink from './PostLink';
import CommentForm from './CommentForm';
import CommentEle from './CommentEle';
import PostDeleted from './PostDeleted';
import { Header } from 'semantic-ui-react';


class Post extends Component {

    render() {
        const { user, post, comments, upvote, downvote, deletePost,
                commentForm, upvoteComment, downvoteComment,
                openLoginModal, addComment, deleteComment,
                changeCommentForm } = this.props;

        let commentEles = comments.map(comment => (
            <CommentEle comment={comment}
                        user={user}
                        key={comment.get('id')}
                        onUpvote={upvoteComment}
                        onDownvote={downvoteComment}
                        openLoginModal={openLoginModal}
                        deleteComment={deleteComment}
            />
        ))

        return(
            <div className="post-wrapper single">
                { post.get('note') &&
                    <div className="post-note">
                        { post.get('note') }
                    </div>
                }
                <PostLink post={ post } />
                <PostInfo post={ post }
                    user={user}
                    onUpvote={upvote}
                    onDownvote={downvote}
                    deletePost={deletePost}
                    openLoginModal={openLoginModal}
                    hidePostCommentLink={true}
                    />
                <div className="comment-container">
                    <Header as='h2' dividing>{comments.size || 0} 코멘트</Header>
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
