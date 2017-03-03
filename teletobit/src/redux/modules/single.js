import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import Request, { requize, pend, fulfill, reject } from 'helpers/request';
import posts from 'helpers/firebase/database/posts';

/* Actions */
const SINGLE_POST_LOAD = 'single/SINGLE_POST_LOAD';
const POST_UPVOTE_UPDATE = 'single/POST_UPVOTE_UPDATE';
const COMMENT_UPVOTE_UPDATE = 'single/COMMENT_UPVOTE_UPDATE';
const COMMENT_TEXT_UPDATE = 'single/COMMENT_TEXT_UPDATE';
const SINGLE_POST_INIT = 'single/SINGLE_POST_INIT';

const POST_EDIT = 'single/POST_EDIT';
const POST_EDIT_CANCEL = 'single/POST_EDIT_CANCEL';
const POST_NOTE_UPDATE = 'single/POST_NOTE_UPDATE';
const POST_TITLE_UPDATE = 'single/POST_TITLE_UPDATE';
const POST_DESCRIPTION_UPDATE = 'single/POST_DESCRIPTION_UPDATE';
const POST_UPDATE_SUBMIT = requize('single/POST_UPDATE_SUBMIT');

const POST_ADD_MESSAGE = 'single/POST_ADD_MESSAGE';

/* action creators */
export const loadSinglePost = createAction(SINGLE_POST_LOAD);
export const updateUpvotePost = createAction(POST_UPVOTE_UPDATE);
export const updateUpvoteComment = createAction(COMMENT_UPVOTE_UPDATE);
export const updateTextComment = createAction(COMMENT_TEXT_UPDATE);
export const initSinglePost = createAction(SINGLE_POST_INIT);

export const editPost = createAction(POST_EDIT);
export const editCancelPost = createAction(POST_EDIT_CANCEL);
export const updatePostNote = createAction(POST_NOTE_UPDATE);
export const updatePostTitle = createAction(POST_TITLE_UPDATE);
export const updatePostDescription = createAction(POST_DESCRIPTION_UPDATE);

export const submitUpdatePost = (post) => ({
    type: POST_UPDATE_SUBMIT.DEFAULT,
    payload: {
        promise: posts.update(post),
    }
});
export const addPostMessage = createAction(POST_ADD_MESSAGE);

/* initialState */
const initialState = Map({
    loaded: false,
    post: null,
    comments: [],
    editable: false,
    message: null
});

/* reducers */
export default handleActions({
    [SINGLE_POST_LOAD]: (state, action) => {
        const { post, comments } = action.payload;
        return state.merge({
            loaded: true,
            post: post,
            comments: comments,
        });
    },
    [POST_UPVOTE_UPDATE]: (state, action) => {
        const upvotes = action.payload;
        return state.setIn(['post', 'upvotes'], upvotes);
    },
    [COMMENT_UPVOTE_UPDATE]: (state,  action) => {
        const { commentId, upvotes } = action.payload;
        const indexOfListingToUpdate = state.get('comments').findIndex(listing => {
            return listing.get('id') === commentId;
        });
        return state.setIn(['comments', indexOfListingToUpdate, 'upvotes'], upvotes);
    },
    [COMMENT_TEXT_UPDATE]: (state, action) => {
        const { commentId, commentText } = action.payload;
        const indexOfListingToUpdate = state.get('comments').findIndex(listing => {
            return listing.get('id') === commentId;
        });
        return state.setIn(['comments', indexOfListingToUpdate, 'text'], commentText);
    },
    [SINGLE_POST_INIT]: (state, action) => {
        state = initialState
        return state
    },
    [POST_EDIT]: (state, action) => {
        return state.set('editable', true);
    },
    [POST_EDIT_CANCEL]: (state, action) => {
        return state.set('editable', false);
    },
    [POST_NOTE_UPDATE]: (state, action) => {
        const note = action.payload;
        return state.setIn(['post', 'note'], note);
    },
    [POST_TITLE_UPDATE]: (state, action) => {
        const title = action.payload;
        return state.setIn(['post', 'title'], title);
    },
    [POST_DESCRIPTION_UPDATE]: (state, action) => {
        const description = action.payload;
        return state.setIn(['post', 'description'], description);
    },
    /* Submit updated post */
    [POST_UPDATE_SUBMIT.PENDING]: (state, action) => {
        return pend(state, 'submitUpdatePost');
    },
    [POST_UPDATE_SUBMIT.FULFILLED]: (state, action) => {
        return fulfill(state, 'submitUpdatePost');
    },
    [POST_UPDATE_SUBMIT.REJECT]: (state, action) => {
        const error = action.payload;
        return reject(state, 'submitUpdatePost', error);
    },
    [POST_ADD_MESSAGE]: (state, action) => {
        const message = action.payload;
        return state.set('message', message);
    }
}, initialState);
