import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* Actions */
const SINGLE_POST_LOAD = 'single/SINGLE_POST_LOAD';
const POST_UPVOTE_UPDATE = 'single/POST_UPVOTE_UPDATE';
const COMMENT_UPVOTE_UPDATE = 'single/COMMENT_UPVOTE_UPDATE';
const SINGLE_POST_INIT = 'single/SINGLE_POST_INIT';

/* action creators */
export const loadSinglePost = createAction(SINGLE_POST_LOAD);
export const updateUpvotePost = createAction(POST_UPVOTE_UPDATE);
export const updateUpvoteComment = createAction(COMMENT_UPVOTE_UPDATE);
export const initSinglePost = createAction(SINGLE_POST_INIT);

/* initialState */
const initialState = Map({
    loaded: false,
    post: null,
    comments: []
});

/* reducers */
export default handleActions({
    [SINGLE_POST_LOAD]: (state, action) => {
        const { post, comments } = action.payload;
        return state.merge({
            loaded: true,
            post: post,
            comments: comments
        });
    },
    [POST_UPVOTE_UPDATE]: (state, action) => {
        const upvotes = action.payload;
        return state.setIn(['post', 'upvotes'], upvotes);
    },
    [COMMENT_UPVOTE_UPDATE]: (state,  action) => {
        const { commentId, upvotes } = action.payload;
        console.log("single-", commentId, upvotes );
        const indexOfListingToUpdate = state.get('comments').findIndex(listing => {
            console.log("id", listing.get('id'));
            return listing.get('id') === commentId;
        });
        return state.setIn(['comments', indexOfListingToUpdate, 'upvotes'], upvotes);
    },
    [SINGLE_POST_INIT]: (state, action) => {
        state = initialState
        return state
    }
}, initialState);
