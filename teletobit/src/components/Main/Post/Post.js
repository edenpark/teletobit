import React from 'react';
import { Link } from 'react-router';
import PostLink from './PostLink';
import PostInfo from './PostInfo';

const Post = ({ user, post, upvote, downvote, openLoginModal, deletePost }) => {
    return(
        <div className="post-wrapper">
            { post.get('note') &&
                <div className="post-note">
                    { post.get('note') }
                </div>
            }
            <PostLink post={ post } />
            <PostInfo post={ post }
                    user={user}
                    onUpvote={upvote}
                    onDownvote={downvote}
                    openLoginModal={openLoginModal}
                    hidePostCommentLink={false}
                    deletePost={deletePost}
            />
        </div>
    );
};

export default Post;
