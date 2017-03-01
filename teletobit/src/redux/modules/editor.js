import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import Request, { requize, pend, fulfill, reject } from 'helpers/request';
import posts from 'helpers/firebase/database/posts';

/* Actions */
const EDITOR_SHOW= 'editor/EDITOR_SHOW';
const EDITOR_HIDE = 'editor/EDITOR_HIDE';

const EDITOR_LINK_SET = 'editor/EDITOR_LINK_SET';
const EDITOR_NOTE_SET = 'editor/EDITOR_NOTE_SET';
const EDITOR_METADATA_SET = 'editor/EDITOR_METADATA_SET';
const EDITOR_VALIDATION_SET = 'editor/EDITOR_VALIDATION_SET';

const EDITOR_POST_SUBMIT = requize('editor/EDITOR_SUBMIT');
const EDITOR_POST_SUBMITTING = 'editor/EDITOR_POST_SUBMITTING';
const EDITOR_INITIALIZE = 'editor/EDITOR_INITIALIZE';

const EDITOR_TITLE_CHANGE = 'editor/EDITOR_TITLE_CHANGE';
const EDITOR_DESCRIPTION_CHANGE = 'editor/EDITOR_DESCRIPTION_CHANGE';
/* action creators */
export const showEditor = createAction(EDITOR_SHOW);
export const hideEditor = createAction(EDITOR_HIDE);

export const setEditorLink = createAction(EDITOR_LINK_SET);
export const setEditorNote = createAction(EDITOR_NOTE_SET);
export const setEditorMetadata = createAction(EDITOR_METADATA_SET);
export const setEditorValidity = createAction(EDITOR_VALIDATION_SET);

export const changeEditorTitle = createAction(EDITOR_TITLE_CHANGE);
export const changeEditorDescription = createAction(EDITOR_DESCRIPTION_CHANGE);

export const submitEditorPost = (post) => ({
    type: EDITOR_POST_SUBMIT.DEFAULT,
    payload: {
        promise: posts.create(post),
    }
});
export const submittingEditorPost = createAction(EDITOR_POST_SUBMITTING);
export const initializeEditor = createAction(EDITOR_INITIALIZE);

/* initialState */
const initialState = Map({
    submitting: false,
    visible: false,
    link: '',
    note: null,
    validity: Map({
        fetching: false,
        valid: false,
        message: null,
        fetched: false,
    }),
    metadata: Map({
        title: '',
        description: '',
        source: '',
    })
});

/* reducers */
export default handleActions({
    [EDITOR_SHOW]: (state, action) => {
        return state.set('visible', true)
    },
    [EDITOR_HIDE]: (state, action) => {
        return state.set('visible', false)
    },
    [EDITOR_LINK_SET]: (state, action) => {
        const value = action.payload;
        return state.set('link', value)
    },
    [EDITOR_NOTE_SET]: (state, action) => {
        const value = action.payload;
        return state.set('note', value)
    },
    [EDITOR_METADATA_SET]: (state, action) => {
        const { title, description, source } = action.payload;

        return state.set('metadata', {
            title,
            description: (!description) ? title : description,
            source
        })
    },
    [EDITOR_VALIDATION_SET]: (state, action) => {
        const { fetching, valid, message, fetched } = action.payload
        return state.set('validity', {
            fetching,
            valid,
            message,
            fetched,
        })
    },
    [EDITOR_TITLE_CHANGE]: (state, action) => {
        const title = action.payload;
        const metadata = state.get('metadata')
        return state.set('metadata', {
            title,
            description: metadata.description,
            source: metadata.source
        })
    },
    [EDITOR_DESCRIPTION_CHANGE]: (state, action) => {
        const description = action.payload;
        const metadata = state.get('metadata')
        return state.set('metadata', {
            title: metadata.title,
            description,
            source: metadata.source
        })
    },
    /* Submit new post */
    [EDITOR_POST_SUBMIT.PENDING]: (state, action) => {
        return pend(state, 'submitEditorPost');
    },
    [EDITOR_POST_SUBMIT.FULFILLED]: (state, action) => {
        return fulfill(state, 'submitEditorPost');
    },
    [EDITOR_POST_SUBMIT.REJECT]: (state, action) => {
        const error = action.payload;
        return reject(state, 'submitEditorPost', error);
    },
    [EDITOR_POST_SUBMITTING]: (state, action) => {
        return state.set('submitting', true)
    },
    [EDITOR_INITIALIZE]: (state, action) => {
        state = initialState
        return state
    }
}, initialState);
