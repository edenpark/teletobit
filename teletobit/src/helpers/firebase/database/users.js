const usersHelper = (() => {

    let usersRef, postsRef = null;

    return {
        // Initialize helpers
        initialize: (database) => {
            usersRef = database.ref('users/');
            postsRef = database.ref('posts/');
        },

        /* Find */
        findProfileById: (uid) => {
            return usersRef.child(uid).child('profile').once('value');
        },

        findProfileByIdSync: (uid, callback) => {
            const ref = usersRef.child(uid).child('profile');
            ref.on('value', callback)
            return ref;
        },

        checkUsername: async (username) => {
            // const data = await usersRef.child('usernames').child(username).once('value');
            const data = await usersRef.orderByChild('username').equalTo(username).once('value');
            console.log(data.exists());
            return { available: !data.exists() };
        },

        /* Update */
        upvotePost: ({ userId, postId }) => {
            usersRef.child(`${userId}/profile/upvoted/${postId}`).set(true, (error) => {
                if(error) { return; }

                // Increment post's upvotes
                postsRef.child(`${postId}/upvotes`).transaction(curr => (curr || 0) + 1);
            });
        },

        downvotePost: ({ userId, postId }) => {
            usersRef.child(`${userId}/profile/upvoted/${postId}`).remove((error) => {
                if (error) { return; }
                // Decrement post's upvotes
                postsRef.child(`${postId}/upvotes`).transaction(curr => (curr || 0) - 1);
            });
        },

        /* Create */
        create: ({uid, username, displayName, email, thumbnail}) => {
            const profile = usersRef.child(uid).child('profile').set({
                uid,
                username,
                displayName,
                thumbnail: thumbnail || 'https://firebasestorage.googleapis.com/v0/b/bitcoin-news-kr.appspot.com/o/static%2FBNK_user_icon.jpg?alt=media&token=c6ec960c-596f-4e3c-976e-366af723b4f6',
            });

            const setting = usersRef.child(uid).child('setting').set({
                email
            });

            return Promise.all([profile, setting]);

        }
    }

})();

export default usersHelper;

// import * as firebase from 'firebase';
// export function findUserById(uid) {
//     return firebase.database().ref('/users/' + uid).once('value');
// }
//
// export function findUserByUsername(username) {
//     const usersRef = firebase.database().ref('/users/');
//     return usersRef.orderByChild('username').equalTo(username).once('child_added')
// }
//
// export function createUserData({uid, email}) {
//     return firebase.database().ref('users/' + uid).set({
//         email,
//     });
// }
//
// // export function updateProviderData({uid, providerData}) {
// //     const updates = {
// //         ['users/' + uid + '/providerData']: providerData
// //     };
// //     return firebase.database().ref().update(updates);
// // }
