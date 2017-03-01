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

import { Loader, Button, Message } from 'semantic-ui-react'
import MetaInspector from 'node-metainspector';
import validator from 'validator';

import translate from 'helpers/translate';

import usersHelper from 'helpers/firebase/database/users';
import postsHelper from 'helpers/firebase/database/posts';


class MainRoute extends Component {

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

    handleEditorData = async (url) => {
        /* This is for testing google translation without CROS

        const { EditorActions } = this.props;

        const orgTitle = 'EU Proposes Storing Personal Data From Digital Currency E-Commerce In The Union';
        const orgDescription = 'A Committee of the European Parliament has proposed an amendment which includes e-commerce transactions using digital currencies, including bitcoin.';
        const source = 'news.bitcoin.com';

        const translateResult = await translate(orgTitle, orgDescription);

        const { title, description } = translateResult;

        EditorActions.setEditorLink(url);
        EditorActions.setEditorMetadata({
            title: title,
            description: description,
            source: source
        });

        // Update validity
        EditorActions.setEditorValidity({
            valid: true,
            message: null,
            fetching: false,
            fetched: true
        });

        */

        const { EditorActions } = this.props;
        const client = new MetaInspector(url, { timeout: 50000});

        client.on('fetch', async () => {
            // console.log("client fetching");
            // const translateResult = await translate(client.title, client.description);
            // const { title, description } = translateResult;
            // console.log(title, description);

            // Update metadata

            EditorActions.setEditorMetadata({
                title: client.title,
                description: client.description,
                source: client.host
            });

            // Update validity
            EditorActions.setEditorValidity({
                valid: true,
                message: null,
                fetching: false,
                fetched: true
            });
        }).on("error", function(err){
            // Show error message
            EditorActions.setEditorValidity({
                valid: false,
                message: '오류가 발생했습니다. 다시 시도해주세요',
                fetching: false,
                fetched: false
            });
        });
        client.fetch();

        // Testing dump data
        // const title = '구글, iOS용 &#8216;크롬&#8217; 오픈소스로 공개';
        // const description = '구글이 iOS용 &#039;크롬&#039; 앱을 오픈소스 기술로 1월31일 공개했다. 크롬은 구글의 오픈소스 웹 기술 &#039;크로미엄&#039; 프로젝트를 기반으로 만든 웹브라우저다. 과거 구글은 애플이 만든 오픈소스 웹브라우저 엔진 &#039;웹킷&#039;을 활용해 크롬을 만들었으나 2013년부터 웹킷을 버리고 독자적인 웹브라우저 엔진 &#039;&#039;를 개발해 크롬에 적용하고 있다. PC용 크롬은 주로 블링크 기반으로 개발됐으나, iOS용 크롬만큼은 그 플랫폼 특징상 웹킷과 블링크를 둘다 지원해야 했다. 구글은 &quot;iOS 플랫폼이 가진 제한 때문에 모든 웹브라우저는 웹킷 렌더링 엔진을 이용해야 했다&quot;라며 &quot;이 과정에서 복잡성이 추가돼 소스코드를 공개하고 싶지 않았다&quot;라고 iOS용 크롬만 오픈소스 기술이 아니었던 이유를 밝혔다. 이번 공개로 크롬은 안드로이드, 맥, 윈도우, 리눅스, 크롬OS 버전과 더불어 iOS용 크롬까지 모두 소스코드가 공개됐으며, 앞으로 오류 및 개선사항 등 외부 피드백을 더 쉽게 받을 수 있게 됐다. 구글은 공식 블로그를 통해 &quot;향후 크롬 관련 개발 속도는 더욱 빨라질 것&quot;이라고 밝혔다. &lt;더버지&gt;는 &quot;앞으로 크롬 iOS 기술을 기반으로 한 새로운 iOS 웹브라우저도 볼 수 있을 것&quot;이라고 기대했다. 크로미엄 프로젝트 공식 홈페이지 iOS용 크롬 소스코';
        // const source = 'www.bloter.net';
        // EditorActions.setEditorMetadata({
        //     title: title,
        //     description: description,
        //     source: source
        // });
        //
        // // Update validity
        // EditorActions.setEditorValidity({
        //     valid: true,
        //     message: null,
        //     fetching: false,
        //     fetched: true
        // });
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

    handleEditorSubmit = () => {
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
        console.log(post);
        const submitPost = EditorActions.submitEditorPost(post);
        const initializeEditor = EditorActions.initializeEditor();
        const updatePosts = this.onPostsUpdate();

        Promise.all([submitPost, initializeEditor, updatePosts]);
    }

    onPostsUpdate = async (sortOption) => {
        const { PostsActions, posts } = this.props;
        const pageNum = posts.get('pageNum');
        if(!sortOption){
            //Default sort value is 'views'
            sortOption = '클릭'
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

    deletePost = (post) => {
        postsHelper.delete(post);
        this.onPostsUpdate();
    }

    openLoginModal = () => {
        const { ModalActions } = this.props;
        ModalActions.openModal({modalName: 'login'});
    }

    upvotePost = ({ itemId, upvotes }) => {
        const { status: { auth }, posts, AuthActions, PostsActions } = this.props;
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
        const { status: { auth }, posts, AuthActions, PostsActions } = this.props;
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

    updateSortBy = (e) => {
        const { PostsActions, posts } = this.props;
        PostsActions.updateSortPost(e.target.value);
        this.onPostsUpdate(e.target.value);
    }
    render () {
        const { mainHandler, handleEditor, handleEditorValidate,
            handleEditorNote, handleEditorSubmit, handlePostLoad,
            handleEditorTitle, handleEditorDescription, handleEditorLink,
            openLoginModal, upvotePost, downvotePost, deletePost,
            updateSortBy } = this;

        const { status: { main, editor, auth }, posts } = this.props;
        const postList = posts.get('posts');

        const nextPage = posts.get('nextPage');
        const currentPage = posts.get('currentPage');
        const loading = posts.get('loading');

        const visibleEditor= editor.get('visible');
        const Submitting= editor.get('Submitting');

        const postEls = postList.size
            ? postList.map((post) =>
                (
                    <Post post={ post }
                          user={ auth }
                          key={ post.get('id') }
                          upvote={ upvotePost }
                          downvote={ downvotePost }
                          openLoginModal={openLoginModal}
                          deletePost={deletePost}
                    />
                )
            )
            : 'There are no posts yet!';

        // possible sort values
        const sortValues = Object.keys(posts.getIn(['sortOptions', 'values']));
        const options = sortValues.map((optionText, i) => (
            <li key={ i }>
                <label className="sortby"
                    htmlFor={ optionText }>
                    { optionText }
                </label>
                <input type="radio"
                    id={ optionText }
                    name="sortby"
                    value={ sortValues[i] }
                    checked={posts.getIn(['sortOptions', 'currentValue']) === optionText ? true : false}
                    onChange={updateSortBy}
                />
            </li>
        ));
        // <option value={ sortValues[i] } key={ i }>{ optionText }</option>

        return (
            <Main>
                <LeftColumn>
                    Left
                </LeftColumn>
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
                        <ul>{ options }</ul>
                    </div>
                    <Posts>
                        {
                            loading || Submitting ?
                                <Loader active inline="centered"/>
                                : postEls
                        }
                    </Posts>
                    <div className="loadmore-wrapper">
                    {
                        nextPage ?
                                <Button color="pink"
                                        size="small"
                                        onClick={handlePostLoad}
                                >
                                    더 읽기
                                </Button>
                            :     <Message
                                    icon='smile'
                                    header='끝까지 다 읽으셨습니다'
                                    content='여기까지 읽어주셔서 감사합니다!'
                                    color="pink"
                                    size="small"
                                  />

                    }
                    </div>
                </CenterColumn>
                <RightColumn>
                    Right
                </RightColumn>
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
// <select
//     id="sortby-select"
//     className="sortby-select"
//     onChange={updateSortBy}
//     value={ posts.getIn(['sortOptions', 'currentValue']) }
// >
//     { options }
// </select>
