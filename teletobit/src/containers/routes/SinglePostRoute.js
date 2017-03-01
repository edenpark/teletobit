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
        console.log("let's request updatepostview - ", postId);
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
        console.log(data);
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
        const { username } = this.props.params;
        postsHelper.delete(post);

        this.context.router.push('/');
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
        commentsHelper.deleteComment(comment);
        // SinglePostActions.addComment(comment);

        handlePostLoad();
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

    render () {
        const { single, auth, form } = this.props;
        const post = single.get('post');
        const { upvotePost, downvotePost, deletePost, openLoginModal,
                addComment, deleteComment, changeCommentForm,
                upvoteComment, downvoteComment } = this;
        const { postId }  = this.props.params;
        const { isDeletedPost } = this.state;

        return (
            <SinglePost>
                {
                    single.get('loaded') &&
                    <Helmet
                    htmlAttributes={{lang: "ko", amp: undefined}} // amp takes no value
                    title={`${decode(post.get('title'))} - 텔레토빗`}
                    titleAttributes={{itemprop: "name", lang: "ko"}}
                    base={{target: "_blank", href: "http://localhost:3000"}}
                    meta={[
                        {name: "description", content: `${post.get('description')} - 텔레토빗`},
                        {property: "og:type", content: "article"}
                    ]}
                    />
                }
                <LeftColumn>
                    Left
                </LeftColumn>
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
                                comments={single.get('comments')}
                                user={auth}
                                key={postId}
                                upvote={ upvotePost }
                                downvote={ downvotePost }
                                deletePost={ deletePost }
                                upvoteComment={ upvoteComment }
                                downvoteComment={ downvoteComment }
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
                <RightColumn>
                    Right
                </RightColumn>
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
