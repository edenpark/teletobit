import * as firebase from 'firebase';
import config from './config';

import authHelper from './auth';
import databaseHelper from './database';


const firebaseHelper = (
    () => {

        return {
            initialize: () => {

                // Initialize firebase
                firebase.initializeApp(config);

                // Initialize the helpers
                const auth = firebase.auth();
                const database = firebase.database();
                
                authHelper.initialize(auth);
                databaseHelper.initialize(database);
            }

        }
    }
)();

export default firebaseHelper;
