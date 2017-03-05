import React, { Component } from 'react';
import { Link } from 'react-router';
import Upvote from 'components/Main/Post/Upvote';
import timeAgo from 'util/timeAgo';
import { Form, TextArea, Message, Loader } from 'semantic-ui-react';

class CommentEle extends Component {

    state = {
        editable: false,
        commentText: this.props.comment.get('text'),
        message: '',
        deleting: false
    }

    handleDeleteComment = () => {
        const { comment, deleteComment } = this.props;
        var commentObj = {}

        // Convert map to object
        comment.forEach((value, key) => {
            commentObj[key] = value
        });
        deleteComment(commentObj);

        this.setState({
            deleting: true
        })

    }

    handleEditComment = () => {
        this.setState({
            editable: true
        })
    }

    handleChangeComment = (e) => {
        this.setState({
            commentText: e.target.value
        })
    }

    handleCancelUpdate = () => {
        this.setState({
            editable: false,
            commentText: this.props.comment.get('text'),
            message: ''
        })
    }

    handleSubmitComment = () => {
        const { updateComment, comment } = this.props;
        const { commentText } = this.state;

        if(!commentText) {
            this.setState({
                message: '코멘트를 입력해주세요'
            })
            return;
        }

        this.setState({
            editable: false
        })

        updateComment({
            commentId: comment.get('id'),
            commentText
        });
    }

    render() {
        const { comment, user, onDownvote, onUpvote, openLoginModal } = this.props;

        const { handleDeleteComment, handleCancelUpdate,
            handleEditComment, handleSubmitComment, handleChangeComment } = this;

        const { editable, commentText, message, deleting } = this.state;

        const userUpvotes = !!user.getIn(['profile', 'upvoted']);
        const isUpvoted = userUpvotes ?
                        !!user.getIn(['profile', 'upvoted', comment.get('id')]) : false;

        const creatorIsLoggedIn = user.getIn(['profile', 'uid']) === comment.get('creatorUID');

        return(
            <div className="comment-wrapper">
                <div className="comment-text">
                    <TextArea
                        disabled={editable ? false : true}
                        autoHeight
                        value={commentText}
                        name="text"
                        onChange={ (e) => handleChangeComment(e) }
                    />
                    {
                        message && (
                            <Message color="red" size="mini">
                                { message }
                            </Message>
                        )
                    }
                </div>
                <div className="comment-info">
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
                    <span className="creator">
                        <Link to={`/profile/${comment.get('creator')}`}>@{comment.get('creator')}</Link>
                    </span>
                    <span className="time">{ timeAgo(comment.get('time')) }</span>
                    {
                        creatorIsLoggedIn && !editable && (
                            <span className="comment-setting">
                                <span className="creator-option"
                                    onClick={handleEditComment}>
                                    수정
                                </span>
                                <span className="creator-option"
                                    onClick={handleDeleteComment}>
                                    삭제
                                    { deleting && <Loader active inline /> }
                                </span>
                            </span>
                        )

                    }
                    {
                        creatorIsLoggedIn && editable && (
                            <span className="comment-setting">
                                <span className="creator-option"
                                    onClick={handleCancelUpdate}>
                                    취소
                                </span>
                                <span className="creator-option"
                                    onClick={handleSubmitComment}>
                                    저장
                                </span>
                            </span>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default CommentEle;
