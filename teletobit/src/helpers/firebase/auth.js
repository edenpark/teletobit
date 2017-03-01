import * as firebase from 'firebase';

const authHelper = (function() {

    let auth;

    const providers = {
        google: (new firebase.auth.GoogleAuthProvider()),
        facebook: (new firebase.auth.FacebookAuthProvider())
    };

    return {
        initialize: function(authInstance) {
            auth = authInstance;
        },
        signInWithPopup: (provider) => {
            return auth.signInWithPopup(providers[provider]);
        },
        logout: () => {
            return firebase.auth().signOut();
        },
        getExistingProvider: async (email) => {
            const exisitngProviders = await firebase.auth().fetchProvidersForEmail(email);
            const provider = exisitngProviders[0].split('.')[0];
            return provider;
        },
        resolveDuplicate: async (error) => {
            const { credential, email } = error;
            const exisitngProviders = await firebase.auth().fetchProvidersForEmail(email);
            const provider = exisitngProviders[0].split('.')[0];
            const result = await firebase.auth().signInWithPopup(providers[provider]);
            return result.user.link(credential);
        },
        authStateChanged: (callback) => {
            // callback receives 'user' as a parameter
            firebase.auth().onAuthStateChanged(callback);
        },
        linkAccount: async ({provider, credential}) => {
            const result = await firebase.auth().signInWithPopup(providers[provider]);
            return result.user.link(credential);
        }
    }
})();

export default authHelper;
