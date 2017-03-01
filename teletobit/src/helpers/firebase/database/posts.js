const postsHelper = (() => {

    let postsRef, usersRef, commentsRef = null;

    let postsPerPage = 10;

    const sortValues = {
        // values mapped to firebase locations at baseRef/posts
        클릭: 'views',
        최신: 'time',
        추천: 'upvotes'
    };

    let data = {
        posts: [],
        currentPage: 1,
        nextPage: true,
    };

    let postData = {
        post: {},
        comments: []
    };

    return {
        // Initialize helpers
        initialize: (database) => {
            postsRef = database.ref('posts/');
            usersRef = database.ref('users/');
            commentsRef = database.ref('comments/');
        },

        /* Find */
        getDefaultData() {
            return data;
        },

        async watchPosts({pageNum, sortValue}) {
            data.currentPage = pageNum;

            // +1 extra post to determine whether another page exists
            let returnedData = await postsRef.orderByChild(sortValues[sortValue])
                                        .limitToLast((data.currentPage * postsPerPage) + 1)
                                        .once('value');


            if(returnedData) {
                const watchPosts = await this.updatePosts(returnedData);

                return watchPosts
            }

            return false
        },

        stopWatchingPosts() {
            postsRef.off();
        },

        async watchPost(postId) {
            const returnPostData = await postsRef.child(postId).once('value');
            console.log(returnPostData.val());

            if(returnPostData.val()) {
                let watchPostData = await this.updatePost(returnPostData);

                const returnCommentsData = await commentsRef.orderByChild('postId')
                .equalTo(postId)
                .once('value');

                watchPostData = await this.updateComments(returnCommentsData);

                return watchPostData
            }

            return false
        },

        /* Update */
        updatePosts(postDataObj) {
            // newPosts will be aall posts through current page + 1
            let endAt = data.currentPage * postsPerPage;

            // add posts to new array
            let newPosts = [];
            postDataObj.forEach(postData => {
                let post = postData.val();
                if(!post.isDeleted) {
                    post.id = postData.key;
                    newPosts.unshift(post);
                }
            });

            // if extra post doesn't exist, indicate that there are no more posts
            data.nextPage = (newPosts.length === endAt + 1);

            // slice off extra post
            data.posts = newPosts.slice(0, endAt);

            return data;
        },

        updatePost(postDataObj) {
            let post = postDataObj.val();

            if (!post) {
                // post doesn't exist
                postData.post = null;
            } else {
                post.id = postDataObj.key;
                postData.post = post;
            }

            return postData;
        },

        updateComments(commentDataobj) {
            let newComments = [];

            commentDataobj.forEach(commentData => {
                let comment = commentData.val();
                comment.id = commentData.key;
                newComments.unshift(comment);
            });

            postData.comments = newComments;
            return postData;
        },

        async updatePostView(postId) {
            // Update post views
            console.log('update post view - ', postId);
            postsRef.child(`${postId}/views`).transaction(curr => (curr || 0) + 1);
        },

        /* Delete */
        delete: (post) => {
            postsRef.child(post.id).set({isDeleted: true}, (error) => {
                if(error) { return; }

                // Delete commentId from user profile
                usersRef.child(`${post.creatorUID}/profile/submitted/${post.id}`).remove();
            });
        },

        /* Create */
        create: (post) => {
            let newPostRef = postsRef.push(post, (error) => {
                if(error) {
                    console.log('createpost error: ', error);
                    return;
                }

                let postId = newPostRef.key;

                usersRef.child(`${post.creatorUID}/profile/submitted/${postId}`).set(true);
            });

        }
    }

})();

export default postsHelper;
