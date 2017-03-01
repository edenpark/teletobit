import React, { Component } from 'react';
import { Link } from 'react-router';
import Upvote from 'components/Main/Post/Upvote';
import timeAgo from 'util/timeAgo';
import { Icon } from 'semantic-ui-react';
import decode from 'ent/decode';

class CommentEle extends Component {
    handleDeleteComment = () => {
        const { comment, deleteComment } = this.props;
        var commentObj = {}

        // Convert map to object
        comment.forEach((value, key) => {
            commentObj[key] = value
        });
        deleteComment(commentObj);

    }

    render() {
        const { comment, user, onDownvote, onUpvote, openLoginModal } = this.props;

        const { handleDeleteComment } = this;

        const userUpvotes = !!user.getIn(['profile', 'upvoted']);
        const isUpvoted = userUpvotes ?
                        !!user.getIn(['profile', 'upvoted', comment.get('id')]) : false;

        const deleteOption = user.getIn(['profile', 'uid']) === comment.get('creatorUID')
                            && (
                                <span className="delete">
                                    <Icon name='close' onClick={handleDeleteComment}/>
                                </span>
                            );

        return(
            <div className="comment-wrapper">
                <div className="comment-post">
                    <span className="comment-post-item">
                        <Link to={`/post/${comment.get('postId')}`}>{decode(comment.get('postTitle'))}</Link>
                    </span>
                    <span className="comment-post-item">·</span>
                    <span className="comment-post-item time">{ timeAgo(comment.get('time')) }</span>
                </div>
                <div className="comment-text">
                    {comment.get('text')}
                </div>
                <div className="comment-footer">
                    <span className="upvote">
                        <Upvote
                            user={user}
                            itemId={comment.get('id')}
                            isUpvoted={isUpvoted}
                            upvotes={comment.get('upvotes') || 0}
                            onUpvote={onUpvote}
                            onDownvote={onDownvote}
                            openLoginModal={openLoginModal}
                            />
                    </span>
                    { deleteOption }
                </div>
            </div>
        );
    }
}

export default CommentEle;
