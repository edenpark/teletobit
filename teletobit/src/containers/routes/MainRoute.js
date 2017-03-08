import React, { Component } from 'react';

import Main, {
    LeftColumn,
    CenterColumn,
    RightColumn,
    Write,
    Editor,
    Posts,
    Post
} from 'components/Main/Main';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as main from 'redux/modules/main';
import * as modal from 'redux/modules/base/modal';
import * as auth from 'redux/modules/base/auth';
import * as editor from 'redux/modules/editor';
import * as posts from 'redux/modules/posts';

// import translate from 'helpers/translate';
import usersHelper from 'helpers/firebase/database/users';
import postsHelper from 'helpers/firebase/database/posts';

import { Loader, Button, Segment } from 'semantic-ui-react'
import validator from 'validator';
import fetch from 'node-fetch';

class MainRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    };

    componentDidMount() {
        this.onPostsUpdate();
    }

    handleEditor = (() => {
        const { EditorActions } = this.props;
        return {
            open: () => {
                EditorActions.showEditor();
            },
            close: () => {
                EditorActions.hideEditor();
            }
        }
    })()

    handleEditorData = (url) => {
        const { EditorActions } = this.props;
        const encodeUrl = encodeURIComponent(url);
        const originUrl = document.location.origin;

        fetch(`${originUrl}/b?url=${encodeUrl}`)
            .then(function(res) {
                return res.json();
            }).then(async function(json) {
                /*
                    Below code for not using tranlate api
                */
                EditorActions.setEditorMetadata({
                    title: json.title,
                    description: json.description,
                    source: json.publisher
                });

                /*
                    Below code for using tranlate api
                */
                // const translateResult = await translate(json);
                // EditorActions.setEditorMetadata({
                //     title: translateResult.title,
                //     description: translateResult.description,
                //     source: json.publisher
                // });

                // Update validity
                EditorActions.setEditorValidity({
                    valid: true,
                    message: null,
                    fetching: false,
                    fetched: true
                });
            })
            .catch(function(err) {
                console.log(err)
                EditorActions.setEditorValidity({
                    valid: false,
                    message: '가져올 데이터가 없는 URL입니다. 확인해주세요',
                    fetching: false,
                    fetched: false
                });
            })

    }

    handleEditorValidate = (url) => {
        const { EditorActions} = this.props;

        if(validator.isURL(url)) {
            EditorActions.setEditorValidity({
                valid: true,
                message: null,
                fetching: true,
                fetched: false
            });
            this.handleEditorData(url);
        } else {
            EditorActions.setEditorValidity({
                valid: false,
                message: '유효한 URL이 아닙니다',
                fetching: false,
                fetched: false
            });
        }
    }

    handleEditorNote = (note) => {
        const { EditorActions} = this.props;
        EditorActions.setEditorNote(note);
    }

    handleEditorTitle = (title) => {
        const { EditorActions} = this.props;
        EditorActions.changeEditorTitle(title);
    }

    handleEditorDescription = (description) => {
        const { EditorActions} = this.props;
        EditorActions.changeEditorDescription(description);
    }

    handleEditorLink = (url) => {
        const { EditorActions } = this.props;
        EditorActions.setEditorLink(url);
    }

    handleEditorSubmit = async () => {
        const { EditorActions, status: { auth, editor } } = this.props;
        EditorActions.submittingEditorPost();

        const { title, description, source } = editor.get('metadata');
        const post = {
            creatorUID: auth.getIn(['profile', 'uid']),
            creator: auth.getIn(['profile', 'username']),
            title: title,
            description: description,
            source: source,
            link: editor.get('link'),
            note: editor.get('note'),
            time: Date.now()
        };

        const submitPostGetKey = await postsHelper.create(post);
        const initializeEditor =  EditorActions.initializeEditor();
        const redirectToPost = this.context.router.push(`/post/${submitPostGetKey}`);
        Promise.all([submitPostGetKey, initializeEditor, redirectToPost]);


    }

    onPostsUpdate = async (sortOption) => {
        const { PostsActions, posts } = this.props;
        const pageNum = posts.get('pageNum');
        if(!sortOption){
            //Default sort value is 'views'
            sortOption = '최신'
        }
        const data = await postsHelper.watchPosts({
            pageNum: pageNum,
            sortValue: sortOption
        });
        PostsActions.updatePostStore(data);

    }

    handlePostLoad = async () => {
        const { PostsActions, posts } = this.props;
        const pageNum = posts.get('pageNum');

        await PostsActions.setPageNum(pageNum + 1);
        this.onPostsUpdate();
    }

    openLoginModal = () => {
        const { ModalActions } = this.props;
        ModalActions.openModal({modalName: 'login'});
    }

    upvotePost = ({ itemId, upvotes }) => {
        const { status: { auth }, AuthActions, PostsActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);

        usersHelper.upvotePost({
            userId: userId,
            postId: itemId
        });
        AuthActions.upvotePost({
            userId: userId,
            postId: itemId
        });
        PostsActions.updateUpvotePost({
            postId: itemId,
            upvotes: upvotes + 1
        })
    }

    downvotePost = ({ itemId, upvotes }) => {
        const { status: { auth }, AuthActions, PostsActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);

        usersHelper.downvotePost({
            userId: userId,
            postId: itemId
        });
        AuthActions.downvotePost({
            userId: userId,
            postId: itemId
        });
        PostsActions.updateUpvotePost({
            postId: itemId,
            upvotes: upvotes - 1
        })
    }

    updateSortBy = (value) => {
        const { PostsActions } = this.props;
        PostsActions.updateSortPost(value);
        this.onPostsUpdate(value);
    }

    render () {
        const { handleEditor, handleEditorValidate,
            handleEditorNote, handleEditorSubmit, handlePostLoad,
            handleEditorTitle, handleEditorDescription, handleEditorLink,
            openLoginModal, upvotePost, downvotePost, updateSortBy } = this;

        const { status: { editor, auth }, posts } = this.props;
        const postList = posts.get('posts');

        const nextPage = posts.get('nextPage');
        const loading = posts.get('loading');

        const visibleEditor= editor.get('visible');
        const Submitting= editor.get('Submitting');

        const postEls = postList.size
            && postList.map((post) =>
                (
                    <Post post={ post }
                          user={ auth }
                          key={ post.get('id') }
                          upvote={ upvotePost }
                          downvote={ downvotePost }
                          openLoginModal={openLoginModal}
                    />
                )
            )

        // possible sort values
        const sortValues = Object.keys(posts.getIn(['sortOptions', 'values']));
        const sortRename = {
            0: '최신순',
            1: '3일간 클릭순',
            2: '7일간 추천순'
        }
        const options = sortValues.map((optionText, i) => (
                <Button
                    basic
                    key={ sortValues[i] }
                    content={ sortRename[i] }
                    className={`sortby ${posts.getIn(['sortOptions', 'currentValue']) === optionText ? 'active' : ''}`}
                    onClick={(e) => updateSortBy(sortValues[i])}
                />
        ));

        return (
            <Main>
                <LeftColumn/>
                <CenterColumn>
                    <Write visible={visibleEditor}
                        onHide={handleEditor.close}
                        onShow={handleEditor.open}>
                        <Editor visible={visibleEditor}
                            editor={editor}
                            user={auth.get('profile')}
                            onValidate={handleEditorValidate}
                            onChangeLink={handleEditorLink}
                            onChangeNote={handleEditorNote}
                            onChangeTitle={handleEditorTitle}
                            onChangeDescription={handleEditorDescription}
                            onSubmit={handleEditorSubmit}
                            openLoginModal={openLoginModal}
                            />
                    </Write>
                    <div className="sortby-wrapper">
                        { options }
                    </div>
                    <Posts>
                        {
                            loading || Submitting ?
                                <Loader active>텔레토빗이 뉴스를 모으는 중입니다</Loader>
                                : postEls
                        }
                    </Posts>
                    {
                        !loading &&

                        <div className="loadmore-wrapper">
                            {
                                nextPage ?

                                <Button basic
                                    color="grey"
                                    size="small"
                                    onClick={handlePostLoad}
                                    >
                                    더 읽기
                                </Button>
                                :
                                <Segment color='teal'>끝까지 다 읽으셨습니다</Segment>

                            }
                        </div>

                    }
                </CenterColumn>
                <RightColumn/>
            </Main>
        )
    }
}

MainRoute = connect(
    state => ({
        status: {
            main: state.main,
            editor: state.editor,
            auth: state.base.auth,
            modal: state.base.modal
        },
        posts: state.posts
    }),
    dispatch => ({
        MainActions: bindActionCreators(main, dispatch),
        EditorActions: bindActionCreators(editor, dispatch),
        PostsActions: bindActionCreators(posts, dispatch),
        ModalActions: bindActionCreators(modal, dispatch),
        AuthActions: bindActionCreators(auth, dispatch)
    })
)(MainRoute);

export default MainRoute;
