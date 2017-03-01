const feedHelper = (() => {

    let postsRef, usersRef = null;

    return {
        // Initialize helpers
        initialize: (database) => {
            postsRef = database.ref('posts/');
            usersRef = database.ref('users/');
        },

        /* Find */
        findPostByLink: async (link) => {
            const userObj = await postsRef.orderByChild('link').equalTo(link).once('value');

            if(!userObj.val()) {
                console.log("findpostlink - true");
                return true;
            }

            console.log("findpostlink - flase")
            return false

        },

        /* Create */
        create: (post) => {

            let newPostRef = postsRef.push(post, (error) => {
                if(error) {
                    console.log('rss createpost error: ', error);
                }

                let postId = newPostRef.key;
                console.log("feed got a key - ", postId);
                usersRef.child(`${post.creatorUID}/profile/submitted/${postId}`).set(true);
            });

        }
    }

})();

export default feedHelper;
