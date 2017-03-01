import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* Actions */
const PROFILE_LOAD = 'profile/PROFILE_LOAD';

const POST_UPVOTE_UPDATE = 'profile/POST_UPVOTE_UPDATE';

const COMMENT_UPVOTE_UPDATE = 'profile/COMMENT_UPVOTE_UPDATE';

/* action creators */
export const loadProfile  = createAction(PROFILE_LOAD);

export const updateUpvotePost = createAction(POST_UPVOTE_UPDATE);

export const updateUpvoteComment = createAction(COMMENT_UPVOTE_UPDATE);

/* initialState */
const initialState = Map({
    userId: '',
    posts: [],
    comments: []
});

/* reducers */
export default handleActions({
    [PROFILE_LOAD]: (state, action) => {
        const data = action.payload;
        return state.merge({
            userId: data.userId,
            posts: data.posts,
            comments: data.comments
        });
    },
    [POST_UPVOTE_UPDATE]: (state, action) => {
        const { postId, upvotes } = action.payload;
        const indexOfListingToUpdate = state.get('posts').findIndex(listing => {
          return listing.get('id') === postId;
        });
        return state.setIn(['posts', indexOfListingToUpdate, 'upvotes'], upvotes);
    },
    [COMMENT_UPVOTE_UPDATE]: (state,  action) => {
        const { commentId, upvotes } = action.payload;
        console.log("comment update reducer");
        const indexOfListingToUpdate = state.get('comments').findIndex(listing => {
          return listing.get('id') === commentId;
        });
        return state.setIn(['comments', indexOfListingToUpdate, 'upvotes'], upvotes);
    }
}, initialState);
