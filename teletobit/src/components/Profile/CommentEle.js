import React, { Component } from 'react';
import { Link } from 'react-router';
import Upvote from 'components/Main/Post/Upvote';
import timeAgo from 'util/timeAgo';
import { Icon } from 'semantic-ui-react';
import decode from 'ent/decode';

class CommentEle extends Component {

    render() {
        const { comment, user, onDownvote, onUpvote, openLoginModal } = this.props;

        const userUpvotes = !!user.getIn(['profile', 'upvoted']);
        const isUpvoted = userUpvotes ?
                        !!user.getIn(['profile', 'upvoted', comment.get('id')]) : false;


        return(
            <div className="comment-wrapper">
                <div className="comment-text">
                    {comment.get('text')}
                </div>
                <div className="comment-info">
                    <Link to={`/post/${comment.get('postId')}`}>{decode(comment.get('postTitle'))}</Link>
                </div>
                <div className="comment-footer">
                    <span className="comment-footer-item upvote">
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
                    <span className="comment-footer-item">·</span>
                    <span className="comment-footer-item time">{ timeAgo(comment.get('time')) }</span>
                </div>
            </div>
        );
    }
}

export default CommentEle;
