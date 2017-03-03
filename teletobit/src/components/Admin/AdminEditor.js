import React, { Component } from 'react';
import {
    Input,
    TextArea,
    Form,
    Button,
    Icon,
    Message
} from 'semantic-ui-react';
// import debounce from 'lodash/debounce';
import decode from 'ent/decode';

class AdminEditor extends Component {

    handleChanageNote = (e) => {
        e.persist();
        this.delayedNoteChange(e);
    }

    delayedNoteChange = (e) => {
        const { onChangeNote } = this.props;
        onChangeNote(e.target.value);
    }

    handleChangeLink = (e) => {
        const { user, openLoginModal, onValidate, onChangeLink } = this.props;

        onChangeLink(e.target.value);

        if(!user.get('username')) {
            openLoginModal();
            return;
        }
        onValidate(e.target.value);
    }

    handleSubmit = (e) => {
        const { user, openLoginModal, onSubmit } = this.props;

        //Login Check
        if(!user.get('username')) {
            openLoginModal();
            return;

        }
        onSubmit();
    }

    render() {

        const { handleChangeLink, handleChanageNote, handleSubmit } = this;

        const { editor, onChangeTitle, onChangeDescription } = this.props;
        const { fetching, fetched, valid, message } = editor.get('validity');
        const { title, description, source } = editor.get('metadata');

        return(
            <div className="admin-editor">
                <div className="link">
                    <Input
                        fluid
                        icon='linkify'
                        iconPosition='left'
                        labelPosition='right'
                        placeholder="URL here"
                        value={editor.get('link')}
                        loading={fetching}
                        onChange={handleChangeLink}
                    />
                </div>
                <div>
                {
                    !valid && message && (
                        <Message color="red" size="mini">
                            { message }
                        </Message>
                    )
                }
                {
                    fetched && (
                        <div>
                            <div className="input-description">
                                <Form>
                                     <TextArea
                                        placeholder="Note here"
                                        autoHeight
                                        onChange={handleChanageNote}
                                    />
                                </Form>
                            </div>
                            <div className="fetching-data">
                                <div className="wrapper">
                                    <div className="title">
                                        <Form>
                                            <TextArea
                                                placeholder="Title here"
                                                autoHeight
                                                value={decode(title)}
                                                onChange={(e) => onChangeTitle(e.target.value)}
                                            />
                                         </Form>
                                    </div>
                                    <div className="description">
                                        <Form>
                                             <TextArea
                                                placeholder="Description here"
                                                autoHeight
                                                value={decode(description)}
                                                onChange={(e) => onChangeDescription(e.target.value)}
                                            />
                                        </Form>
                                    </div>
                                    <div className="source">
                                        {source}
                                    </div>
                                </div>
                            </div>
                            <div className="footer">
                                <Button color="teal"
                                        size="small"
                                        onClick={handleSubmit}
                                        disabled={ !fetched || !valid}
                                >
                                    <Icon name='send' size='small'/>Post Now
                                </Button>
                            </div>
                        </div>
                    )
                }
                </div>
            </div>
        );
    }
}

export default AdminEditor;
