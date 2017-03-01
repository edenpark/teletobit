const profileHelper = (() => {

    let usersRef, postsRef, commentsRef = null;

    let profileData = {
        userId: '',
        posts: [],
        comments: []
    };

    return {
        // Initialize helpers
        initialize: (database) => {
            usersRef = database.ref('users/');
            postsRef = database.ref('posts/');
            commentsRef = database.ref('comments/');
        },

        /* Find */
        getDefaultData() {
            return profileData;
        },

        async getUserId(username) {
            const userObj = await usersRef.orderByChild('profile/username').equalTo(username).once('value');
            
            if(!userObj.val()) {
                return false;
            }
            return Object.keys(userObj.val())[0]

        },

        async whatchProfile(userId) {
            profileData.userId = userId;

            const returnPostData = await postsRef
                                        .orderByChild('creatorUID')
                                        .equalTo(userId)
                                        .limitToLast(100)
                                        .once('value');
            if(returnPostData) {
                await this.updatePosts(returnPostData);
            }

            const returnCommentsData = await commentsRef
                                            .orderByChild('creatorUID')
                                            .equalTo(userId)
                                            .limitToLast(100)
                                            .once('value');
            if(returnCommentsData) {
                await this.updateComments(returnCommentsData);
            }

            return profileData

        },

        updatePosts(postDataObj) {
            // add posts to new array
            let newPosts = [];

            postDataObj.forEach(postData => {
                let post = postData.val();
                post.id = postData.key;
                newPosts.unshift(post);
            });

            // slice off extra post
            profileData.posts = newPosts;

            return profileData;
        },

        updateComments(commentDataObj) {
            let newComments = [];

            commentDataObj.forEach(commentData => {
                let comment = commentData.val();
                comment.id = commentData.key;
                newComments.unshift(comment);
            });

            // slice off extra comment
            profileData.comments = newComments;

            return profileData;
        },

        stopWatchingProfile() {
            postsRef.off();
            commentsRef.off();
        }

    }

})();

export default profileHelper;
