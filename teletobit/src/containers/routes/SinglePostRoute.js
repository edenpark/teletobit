import React, { Component } from 'react';

import SinglePost, {
    LeftColumn,
    CenterColumn,
    RightColumn,
    Post,
    PostDeleted
} from 'components/SinglePost/SinglePost';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as single from 'redux/modules/single';
import * as modal from 'redux/modules/base/modal';
import * as auth from 'redux/modules/base/auth';
import * as form from 'redux/modules/form';

import { Loader } from 'semantic-ui-react'

import usersHelper from 'helpers/firebase/database/users';
import postsHelper from 'helpers/firebase/database/posts';
import commentsHelper from 'helpers/firebase/database/comments';

import Helmet from "react-helmet";
import decode from 'ent/decode';

class SinglePostRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    state = {
        isDeletedPost: false
    }

    componentDidMount() {
        const { handlePostLoad } = this;
        const { FormActions } = this.props;
        const { postId } = this.props.params;

        handlePostLoad();

        //Initialise comment form
        FormActions.initialize('commentForm');

        //Update post views
        postsHelper.updatePostView(postId);
    }

    componentWillUnmount() {
        const { SinglePostActions } = this.props;
        SinglePostActions.initSinglePost();
    }

    handlePostLoad = async () => {
        const { postId } = this.props.params;
        const { SinglePostActions } = this.props;
        let data = await postsHelper.watchPost(postId);

        if(!data) {
            this.context.router.push('/404');
            return;
        }
        if(data && data.post.isDeleted) {
            this.setState({
                isDeletedPost: true
            });
            return;
        }
        SinglePostActions.loadSinglePost(data);

    }

    openLoginModal = () => {
        const { ModalActions } = this.props;
        ModalActions.openModal({modalName: 'login'});
    }

    upvotePost = ({ itemId, upvotes }) => {
        const { auth, AuthActions, SinglePostActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);

        usersHelper.upvotePost({
            userId: userId,
            postId: itemId
        });
        AuthActions.upvotePost({
            userId: userId,
            postId: itemId
        });
        SinglePostActions.updateUpvotePost(upvotes+1);
    }

    downvotePost = ({ itemId, upvotes }) => {
        const { auth, AuthActions, SinglePostActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);

        usersHelper.downvotePost({
            userId: userId,
            postId: itemId
        });
        AuthActions.downvotePost({
            userId: userId,
            postId: itemId
        });
        SinglePostActions.updateUpvotePost(upvotes-1);
    }

    deletePost = (post) => {
        postsHelper.delete(post);

        this.context.router.push('/');
    }

    changeCommentForm = (e) => {
        const { FormActions } = this.props;
        const value = e.target.value;
        FormActions.change({
            formName: 'commentForm',
            name: 'text',
            value
        });
    }

    addComment = (comment) => {
        const { FormActions } = this.props;
        const { handlePostLoad } = this;
        commentsHelper.addComment(comment);
        // SinglePostActions.addComment(comment);

        handlePostLoad();

        //Initialise comment form
        FormActions.initialize('commentForm');
    }

    deleteComment = (comment) => {
        const { handlePostLoad } = this;
        const deletComment = commentsHelper.deleteComment(comment);
        const loadPost = handlePostLoad();
        Promise.all([deletComment, loadPost])
    }

    updateComment = ({ commentId, commentText }) => {
        const { SinglePostActions } = this.props;

        const updateComment = commentsHelper.updateComment({
            commentId,
            commentText
        });

        const updateCommentStore = SinglePostActions.updateTextComment({
            commentId,
            commentText
        })
        Promise.all([updateComment, updateCommentStore])
    }

    upvoteComment = ({ itemId, upvotes }) => {
        const { auth, SinglePostActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);

        commentsHelper.upvoteComment({
            userId: userId,
            commentId: itemId
        });

        SinglePostActions.updateUpvoteComment({
            commentId: itemId,
            upvotes: upvotes + 1
        });

    }

    downvoteComment = ({ itemId, upvotes }) => {
        const { auth, SinglePostActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);

        commentsHelper.downvoteComment({
            userId: userId,
            commentId: itemId
        });

        SinglePostActions.updateUpvoteComment({
            commentId: itemId,
            upvotes: upvotes - 1
        })

    }

    handleEditPost = (() => {
        const { SinglePostActions } = this.props;
        return {
            edit: () => {
                console.log("handleEditPost.edit");
                SinglePostActions.editPost();
            },
            cancel: () => {
                console.log("handleEditPost.cancel");
                SinglePostActions.editCancelPost();
                this.handlePostLoad();
            }
        }
    })()

    handlePostSubmit = () => {
        const { SinglePostActions, single } = this.props;
        const updatedPost = single.get('post');

        if( !updatedPost.get('title') || !updatedPost.get('description') ) {
            SinglePostActions.addPostMessage("모든 필드가 입력되어야 합니다. 다시 확인해주세요.")
            return;
        }

        let postObj = {};
        updatedPost.forEach((value, key) => {
            postObj[key] = value;
        });

        console.log('submit post-> ', postObj);
        const submitPost = SinglePostActions.submitUpdatePost(postObj);
        const initializeEditor = SinglePostActions.initSinglePost();
        const loadPost = this.handlePostLoad();

        Promise.all([submitPost, initializeEditor, loadPost]);
    }

    updatePost = (() => {
        const { SinglePostActions } = this.props;
        return {
            note: (note) => {
                SinglePostActions.updatePostNote(note);
            },
            title: (title) => {
                SinglePostActions.updatePostTitle(title);
            },
            description: (description) => {
                SinglePostActions.updatePostDescription(description);
            }
        }
    })()

    render () {
        const { single, auth, form } = this.props;
        const post = single.get('post');
        const { upvotePost, downvotePost, deletePost, openLoginModal,
                addComment, deleteComment, changeCommentForm,
                upvoteComment, downvoteComment, updateComment,
                handleEditPost, updatePost, handlePostSubmit } = this;
        const { postId }  = this.props.params;
        const { isDeletedPost } = this.state;
        const origin_url = document.location.origin_url;
        const canonical_url = document.location.href;

        return (
            <SinglePost>
                {
                    single.get('loaded') &&
                    <Helmet
                        htmlAttributes={{lang: "ko", amp: undefined}}
                        title={`${decode(post.get('title'))} - 텔레토빗`}
                        defaultTitle={`텔레토빗 - 세계 비트코인 뉴스`}
                        titleAttributes={{itemprop: "name", lang: "ko"}}
                        base={{target: "_blank", href: origin_url}}
                        meta={[
                            {
                                name: "description",
                                content: `${post.get('description')} - 텔레토빗`
                            },
                            {property: "og:type", content: "article"}
                        ]}
                        link={[
                            {rel: "canonical", href: canonical_url},
                        ]}
                    />
                }
                <LeftColumn/>
                <CenterColumn>
                    {
                        isDeletedPost && (
                            <PostDeleted />
                        )
                    }
                    {
                        single.get('loaded') ?
                        (
                            <Post
                                post={post}
                                message={single.get('message')}
                                editable={single.get('editable')}
                                comments={single.get('comments')}
                                user={auth}
                                key={postId}
                                upvote={ upvotePost }
                                downvote={ downvotePost }
                                deletePost={ deletePost }
                                handleEditPost={ handleEditPost}
                                submitUpdatePost={ handlePostSubmit }
                                updatePost={ updatePost }
                                upvoteComment={ upvoteComment }
                                downvoteComment={ downvoteComment }
                                updateComment={ updateComment }
                                openLoginModal={openLoginModal}
                                addComment={ addComment }
                                deleteComment={ deleteComment }
                                changeCommentForm={changeCommentForm}
                                commentForm={ form.getIn(['commentForm', 'text'])}
                                />
                        ) :
                        (
                            !isDeletedPost && <Loader active inline='centered' />
                        )
                    }
                </CenterColumn>
                <RightColumn/>
            </SinglePost>
        )
    }
}

SinglePostRoute = connect(
    state => ({
        single: state.single,
        auth: state.base.auth,
        form: state.form
    }),
    dispatch => ({
        SinglePostActions: bindActionCreators(single, dispatch),
        AuthActions: bindActionCreators(auth, dispatch),
        ModalActions: bindActionCreators(modal, dispatch),
        FormActions: bindActionCreators(form, dispatch)
    })
)(SinglePostRoute);

export default SinglePostRoute;
