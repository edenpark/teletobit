import React, { Component } from 'react';

import Admin, {
    FeedContainer,
    AdminEditor
} from 'components/Admin/Admin';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as auth from 'redux/modules/base/auth';
import * as modal from 'redux/modules/base/modal';
import * as admin from 'redux/modules/admin';

import usersHelper from 'helpers/firebase/database/users';
import postsHelper from 'helpers/firebase/database/posts';
import commentsHelper from 'helpers/firebase/database/comments';

import { Loader } from 'semantic-ui-react'
import fetch from 'node-fetch';
import validator from 'validator';


class AdminRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    state = {
        verification: false
    }

    componentDidMount() {
        const { auth } = this.props;
        if(!auth.getIn(['profile', 'permission']) === 'admin') {
            this.context.router.push('/');
            return;
        }

        this.setState({
            verification: true
        })
    }

    handleEditorData = async (url) => {
        const { AdminActions } = this.props;
        const encodeUrl = encodeURIComponent(url);
        const originUrl = document.location.origin;

        console.log("encodeurl - ", encodeUrl);
        console.log("originUrl-", originUrl);

        fetch(`${originUrl}/b?url=${encodeUrl}` ,{compress:false})
            .then(function(res) {
                return res.json();
            }).then(async function(json) {
                AdminActions.setEditorMetadata({
                    title: json.title,
                    description: json.description,
                    source: json.publisher
                });
                /*
                    Below code for using tranlate api
                */
                // const translateResult = await translate(json);
                // AdminActions.setEditorMetadata({
                //     title: translateResult.title,
                //     description: translateResult.description,
                //     source: json.publisher
                // });

                // Update validity
                AdminActions.setEditorValidity({
                    valid: true,
                    message: null,
                    fetching: false,
                    fetched: true
                });
            })
            .catch(function(err) {
                console.log(err)
                AdminActions.setEditorValidity({
                    valid: false,
                    message: '오류가 발생했습니다. 다시 시도해주세요',
                    fetching: false,
                    fetched: false
                });
            })
    }

    handleEditorValidate = (url) => {
        const { AdminActions} = this.props;

        if(validator.isURL(url)) {
            AdminActions.setEditorValidity({
                valid: true,
                message: null,
                fetching: true,
                fetched: false
            });
            this.handleEditorData(url);
        } else {
            AdminActions.setEditorValidity({
                valid: false,
                message: '유효한 URL이 아닙니다',
                fetching: false,
                fetched: false
            });
        }
    }

    handleEditorNote = (note) => {
        const { AdminActions} = this.props;
        AdminActions.setEditorNote(note);
    }

    handleEditorTitle = (title) => {
        const { AdminActions} = this.props;
        AdminActions.changeEditorTitle(title);
    }

    handleEditorDescription = (description) => {
        const { AdminActions} = this.props;
        AdminActions.changeEditorDescription(description);
    }

    handleEditorLink = (url) => {
        const { AdminActions } = this.props;
        AdminActions.setEditorLink(url);
    }

    handleEditorSubmit = () => {
        const { AdminActions, auth, admin } = this.props;
        AdminActions.submittingEditorPost();

        const { title, description, source } = admin.get('metadata');
        const post = {
            creatorUID: auth.getIn(['profile', 'uid']),
            creator: auth.getIn(['profile', 'username']),
            title: title,
            description: description,
            source: source,
            link: admin.get('link'),
            note: admin.get('note'),
            time: Date.now(),
            view: 0
        };
        const submitPost = AdminActions.submitEditorPost(post);
        const initializeEditor = AdminActions.initializeEditor();

        Promise.all([submitPost, initializeEditor]);
    }

    render () {
        const { verification } = this.state;

        const { handleEditor, handleEditorValidate, handleEditorNote,
            handleEditorSubmit, handleEditorTitle, handleEditorDescription,
            handleEditorLink } = this;

        const { auth, admin } = this.props;

        return (
            <Admin>
                {
                    verification ?
                    (

                        <FeedContainer>
                            <AdminEditor
                                editor={admin}
                                user={auth.get('profile')}
                                onValidate={handleEditorValidate}
                                onChangeLink={handleEditorLink}
                                onChangeNote={handleEditorNote}
                                onChangeTitle={handleEditorTitle}
                                onChangeDescription={handleEditorDescription}
                                onSubmit={handleEditorSubmit}
                            />
                        </FeedContainer>
                    ) :
                    <Loader />
                }

            </Admin>
        )
    }
}

AdminRoute = connect(
    state => ({
        auth: state.base.auth,
        admin: state.admin
    }),
    dispatch => ({
        AuthActions: bindActionCreators(auth, dispatch),
        ModalActions: bindActionCreators(modal, dispatch),
        AdminActions: bindActionCreators(admin, dispatch),

    })
)(AdminRoute);

export default AdminRoute;
