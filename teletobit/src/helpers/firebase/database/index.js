import users from './users';
import posts from './posts';
import comments from './comments';
import profile from './profile';
// import feed from './feed';

// Modulize
const databaseHelper = (() => {
    return {
        initialize: (database) => {
            // Initialize each database helpers
            users.initialize(database);
            posts.initialize(database);
            comments.initialize(database);
            profile.initialize(database);
            // feed.initialize(database);
        }
    }
})();

export default databaseHelper;
