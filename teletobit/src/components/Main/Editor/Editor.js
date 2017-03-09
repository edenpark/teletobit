import React, { Component } from 'react';
import {
    Input,
    TextArea,
    Button,
    Icon,
    Message,
    Segment
} from 'semantic-ui-react';

import decode from 'ent/decode';
import debounce from 'lodash/debounce';


class UrlEditor extends Component {
    constructor(props) {
        super(props);

        this.delayedNoteChange = debounce(this.delayedNoteChange, 100);
    }

    handleChanageNote = (e) => {
        e.persist();
        this.delayedNoteChange(e);
    }

    delayedNoteChange = (e) => {
        const { onChangeNote } = this.props;
        onChangeNote(e.target.value);
    }

    handleChangeTitle = (e) => {
        const { onChangeTitle } = this.props;
        onChangeTitle(e.target.value);
    }

    handleChanageDescription = (e) => {
        const { onChangeDescription } = this.props;
        onChangeDescription(e.target.value);
    }

    handleChangeLink = (e) => {
        const { user, openLoginModal, onValidate, onChangeLink, onHideEditor } = this.props;

        onChangeLink(e.target.value);

        if(!user.get('username')) {
            onHideEditor();
            openLoginModal();
            return;
        }
        onValidate(e.target.value);
    }

    handleSubmit = (e) => {
        const { user, openLoginModal, onSubmit, onHideEditor } = this.props;

        //Login Check
        if(!user.get('username')) {
            onHideEditor();
            openLoginModal();
            return;

        }
        onSubmit();
    }

    render() {
        const { handleChangeLink, handleChanageNote, handleSubmit, handleChanageDescription, handleChangeTitle } = this;

        const { editor, visible } = this.props;
        const { fetching, fetched, valid, message } = editor.get('validity');
        const { title, description, source } = editor.get('metadata');

        return(
            <div className="url-editor">
                {
                    !fetched &&
                    <Segment color='teal'>공유할 주소를 입력하시면 자동으로 페이지의 제목과 요약문을 가져옵니다</Segment>
                }
                <div className="link">
                    <Input
                        fluid
                        type="url"
                        icon='linkify'
                        iconPosition='left'
                        labelPosition='right'
                        placeholder="공유 할 페이지 주소를 넣어주세요."
                        value={editor.get('link')}
                        loading={fetching}
                        onChange={handleChangeLink}
                    />
                </div>
                <div className={`extra ${visible ? 'show': ''}`}>
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
                            <div className="input-note">
                                <Segment color='grey'>가져온 글을 수정하실 수 있습니다 :)</Segment>
                                <TextArea
                                    placeholder="링크에 대한 설명을 덧붙여주세요"
                                    autoHeight
                                    onChange={handleChanageNote}
                                />
                            </div>
                            <div className="fetching-data">
                                <div className="wrapper">
                                    <div className="title">
                                        <TextArea
                                            placeholder="제목"
                                            value={decode(title)}
                                            autoHeight
                                            onChange={handleChangeTitle}
                                        />
                                    </div>
                                    <div className="description">
                                        <TextArea
                                            placeholder="요약"
                                            value={decode(description)}
                                            autoHeight
                                            onChange={handleChanageDescription}
                                        />
                                    </div>
                                    <div className="source">
                                        {source}
                                    </div>
                                </div>
                            </div>
                            <div className="editor-footer">
                                <Button color="teal"
                                        size="small"
                                        onClick={handleSubmit}
                                        disabled={ !fetched || !valid}
                                >
                                    <Icon name='send' size='small'/>보내기
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

export default UrlEditor;
