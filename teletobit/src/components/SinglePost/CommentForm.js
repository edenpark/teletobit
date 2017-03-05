import React, { Component } from 'react';
import { Form, TextArea, Button, Message } from 'semantic-ui-react';

class CommentForm extends Component {
    state = {
        errorMessage: ''
    }

    submitComment = (e) => {
        e.preventDefault();
        const { user, post, commentForm, addComment, openLoginModal } = this.props;

        if(!user.getIn(['profile', 'username'])) {
            openLoginModal();
            return;
        }

        if(!commentForm) {
            console.log('empty');
            this.setState({
                errorMessage: '코멘트를 입력해주세요'
            })
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

        this.setState({
            errorMessage: ''
        })

    }

    render() {
        const { changeCommentForm, commentForm } = this.props;
        const { submitComment } = this;
        const { errorMessage } = this.state;

        return(
            <Form reply onSubmit={ submitComment }>
                <TextArea
                    autoHeight
                    placeholder='생각을 남겨주세요'
                    value={commentForm}
                    name="text"
                    onChange={ (e) => changeCommentForm(e) }
                />
                {
                    errorMessage && (
                        <Message color="red" size="mini">
                            { errorMessage }
                        </Message>
                    )
                }
                { commentForm &&
                    <Button
                        basic
                        color='teal'
                        size='small'
                        content='저장' />
                }
            </Form>
        );
    }
}

export default CommentForm;
