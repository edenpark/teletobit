import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* Actions */
const AUTHENTICATE = 'auth/AUTHENTICATE';
const PROFILE_SYNC = 'auth/PROFILE_SYNC';

const LOGOUT = 'auth/LOGOUT';

const POST_UPVOTE= 'auth/POST_UPVOTE';
const POST_DOWNVOTE= 'auth/POST_DOWNVOTE';

/* action creators */
export const authenticate = createAction(AUTHENTICATE);
export const syncProfile = createAction(PROFILE_SYNC);

export const logout = createAction(LOGOUT);

export const upvotePost = createAction(POST_UPVOTE);
export const downvotePost = createAction(POST_DOWNVOTE);

/* initialState */
const initialState = Map({
    user: '',
    profile: Map({
        username: '',
        displayName: null,
        thumbnail: null,
        submitted: null,
        upvoted: null
    }),
    profileSynced: false,
});

/* reducers */
export default handleActions({
    [AUTHENTICATE]: (state, action) => {
        //Store user initialForm
        const user = action.payload;
        return state.set('user', user);
    },
    [PROFILE_SYNC]: (state, action) => {
        const profile = action.payload;

        if(profile === null) {
            return state.merge({
                profile: initialState.get('profile'),
                profileSynced: true
            })
        }

        return state.merge({
            profile,
            profileSynced: true
        });
    },
    [LOGOUT]: (state, action) => {
        state = initialState
        return state
    },
    [POST_UPVOTE]: (state, action) => {
        const { userId, postId } = action.payload;
        return state.setIn(['profile', 'upvoted'], postId)
    },
    [POST_DOWNVOTE]: (state, action) => {
        const { userId, postId } = action.payload;
        return state.deleteIn(['profile', 'upvoted'], {
            postId
        })
    }
}, initialState);
