import React, { Component } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react';

class CommentForm extends Component {
    state = {
        submitted: false,
        commentText: '',
        errorMessage: ''
    }

    submitComment = (e) => {
        e.preventDefault();
        const { user, post, commentForm, addComment, openLoginModal } = this.props;

        if(!user.getIn(['profile', 'username'])) {
            openLoginModal();
            return;
        }

        let comment = {
            postId: post.get('id'),
            postTitle: post.get('title'),
            text: commentForm,
            creator: user.getIn(['profile', 'username']),
            creatorUID: user.getIn(['profile', 'uid']),
            time: Date.now()
        }

        addComment(comment);

    }

    render() {
        const { changeCommentForm, commentForm } = this.props;
        const { submitComment } = this;

        return(
            <Form reply onSubmit={ submitComment }>
                <TextArea
                    autoHeight
                    value={commentForm}
                    name="text"
                    onChange={ (e) => changeCommentForm(e) }
                />
                <Button
                    content='코멘트 남기기'
                    labelPosition='left'
                    icon='edit'
                    color="teal" />
            </Form>
        );
    }
}

export default CommentForm;
