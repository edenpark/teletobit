import React, { Component } from 'react';
import Profile, {
    LeftColumn,
    CenterColumn,
    RightColumn,
    Post,
    CommentEle
} from 'components/Profile/Profile';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as profile from 'redux/modules/profile';
import * as main from 'redux/modules/main';
import * as modal from 'redux/modules/base/modal';
import * as auth from 'redux/modules/base/auth';

import profileHelper from 'helpers/firebase/database/profile';
import postsHelper from 'helpers/firebase/database/posts';
import usersHelper from 'helpers/firebase/database/users';
import commentsHelper from 'helpers/firebase/database/comments';

import { Loader, Header, Divider } from 'semantic-ui-react'


class ProfileRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    state = {
        loading: true
    }

    componentDidMount() {
        const { username } = this.props.params;
        this.loadProfile(username);
    }

    componentWillReceiveProps(nextProps) {
        const oldUserName = this.props.params.username;
        const newUserName = nextProps.params.username;

        if(oldUserName !== newUserName) {
            this.setState({
                loading: true
            });

            profileHelper.stopWatchingProfile();
            this.loadProfile(newUserName);
        }


    }

    loadProfile = async (username) => {
        const { ProfileActions } = this.props;

        const userId = await profileHelper.getUserId(username);
        if(!userId) {
            return this.context.router.push('/404');
        }

        const profileData = await profileHelper.whatchProfile(userId);

        ProfileActions.loadProfile(profileData);

        this.setState({
            loading: false
        })

    }

    deletePost = (post) => {
        const { username } = this.props.params;
        postsHelper.delete(post);

        this.loadProfile(username);
    }

    openLoginModal = () => {
        const { ModalActions } = this.props;
        ModalActions.openModal({modalName: 'login'});
    }

    upvotePost = ({ itemId, upvotes }) => {
        const { auth, AuthActions, ProfileActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);
        console.log(itemId, upvotes);
        usersHelper.upvotePost({
            userId: userId,
            postId: itemId
        });
        AuthActions.upvotePost({
            userId: userId,
            postId: itemId
        });
        ProfileActions.updateUpvotePost({
            postId: itemId,
            upvotes: upvotes + 1
        })
    }

    downvotePost = ({ itemId, upvotes }) => {
        const { auth, AuthActions, ProfileActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);
        console.log(itemId, upvotes);

        usersHelper.downvotePost({
            userId: userId,
            postId: itemId
        });
        AuthActions.downvotePost({
            userId: userId,
            postId: itemId
        });
        ProfileActions.updateUpvotePost({
            postId: itemId,
            upvotes: upvotes - 1
        })
    }

    upvoteComment = ({ itemId, upvotes }) => {
        const { auth, ProfileActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);
        console.log(itemId, upvotes);

        commentsHelper.upvoteComment({
            userId: userId,
            commentId: itemId
        });

        ProfileActions.updateUpvoteComment({
            commentId: itemId,
            upvotes: upvotes + 1
        });

    }

    downvoteComment = ({ itemId, upvotes }) => {
        const { auth, ProfileActions } = this.props;
        const userId = auth.getIn(['profile', 'uid']);
        console.log(itemId, upvotes);

        commentsHelper.downvoteComment({
            userId: userId,
            commentId: itemId
        });

        ProfileActions.updateUpvoteComment({
            commentId: itemId,
            upvotes: upvotes - 1
        })

    }

    deleteComment = (comment) => {
        const { username } = this.props.params;

        commentsHelper.deleteComment(comment);

        this.loadProfile(username);
    }

    render() {
        const { username } = this.props.params;
        const { loading } = this.state;
        const { profile, auth } = this.props;
        const { upvotePost, downvotePost, openLoginModal, deletePost,
                upvoteComment, downvoteComment, deleteComment} = this;

        const posts = profile.get('posts');
        const comments = profile.get('comments');

        let postList, commentsList, postHeader, commentsHeader;

        if(loading) {
            postHeader = <Header as='h3'>최근 공유한 뉴스 로딩중</Header>;
            postList = <Loader active inline='centered' />;
            commentsHeader = <Header as='h3'>최근 작성한 코멘트 로딩중</Header>;
            commentsList = <Loader active inline='centered' />;
        } else {
            postHeader = <Header as='h3'>{ posts.size ? `최근 공유한 뉴스` : '공유한 뉴스가 없습니다'}</Header>;
            postList = posts.map(post => (
                <Post post={post}
                    user={auth}
                    key={post.get('id')}
                    upvote={ upvotePost }
                    downvote={ downvotePost }
                    openLoginModal={openLoginModal}
                    deletePost={deletePost}
                />
            ));

            commentsHeader = <Header as='h3'>{ comments.size ? '최근 작성한 코멘트' : '작성한 코멘트가 없습니다'}</Header>;
            commentsList = comments.map(comment => (
                <CommentEle
                    comment={comment}
                    user={auth}
                    key={comment.get('id')}
                    onUpvote={upvoteComment}
                    onDownvote={downvoteComment}
                    openLoginModal={openLoginModal}
                    deleteComment={deleteComment}
                />
            ));
        }


        return(
            <Profile>
                <LeftColumn>
                    Left
                </LeftColumn>
                <CenterColumn>
                    <Header as='h2'>
                        @{username}
                    </Header>
                    <Divider />
                    <div className="posts-wrapper">
                        { postHeader }
                        { postList }
                    </div>
                    <div className="comments-wrapper">
                        { commentsHeader }
                        { commentsList }
                    </div>
                </CenterColumn>
                <RightColumn>
                    Right
                </RightColumn>
            </Profile>
        );
    }
}

ProfileRoute = connect(
    state => ({
        profile: state.profile,
        auth: state.base.auth,
        main: state.main,
        modal: state.base.modal
    }),
    dispatch => ({
        ProfileActions: bindActionCreators(profile, dispatch),
        MainActions: bindActionCreators(main, dispatch),
        ModalActions: bindActionCreators(modal, dispatch),
        AuthActions: bindActionCreators(auth, dispatch)
    })
)(ProfileRoute);

export default ProfileRoute;
