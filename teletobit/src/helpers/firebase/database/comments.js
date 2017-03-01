const commentsHelper = (() => {

    let commentsRef, usersRef, postsRef = null;

    return {
        // Initialize helpers
        initialize: (database) => {
            commentsRef = database.ref('comments/');
            usersRef = database.ref('users/');
            postsRef = database.ref('posts/');
        },

        /* Create */
        addComment: (comment) => {
            let newCommentRef = commentsRef.push(comment, (error) => {
                if(error) {
                    console.log('createpost error: ', error);
                }
                // Increment comment count on post
                postsRef.child(`${comment.postId}/commentCount`)
                        .transaction(curr => (curr || 0) + 1);

                let commentId = newCommentRef.key;

                // Add commentId to user's profile
                usersRef.child(`${comment.creatorUID}/profile/submitted/${commentId}`).set(true);
            });

        },

        /* Delete */
        deleteComment: (comment) => {
            commentsRef.child(comment.id).remove((error) => {
                if(error) { return; }
                // Decrement comment count on post
                postsRef.child(`${comment.postId}/commentCount`).transaction(curr => (curr || 0) - 1);

                // Delete commentId from user's profile
                usersRef.child(`${comment.creatorUID}/profile/submitted/${comment.id}`).remove();
            });
        },

        /* Update */
        upvoteComment: ({ userId, commentId }) => {
            // Record upvote on user's profile
            usersRef.child(`${userId}/profile/upvoted/${commentId}`).set(true, (error) => {
                if(error) { return; }

                //Increment comment's upvotes
                commentsRef.child(`${commentId}/upvotes`).transaction(curr => (curr || 0) + 1);
            });
        },

        downvoteComment: ({ userId, commentId }) => {
            // Record upvote on user's profile
            usersRef.child(`${userId}/profile/upvoted/${commentId}`).remove((error) => {
                if(error) { return; }

                //Increment comment's upvotes
                commentsRef.child(`${commentId}/upvotes`).transaction(curr => (curr || 0) - 1);
            });
        }
    }

})();

export default commentsHelper;
