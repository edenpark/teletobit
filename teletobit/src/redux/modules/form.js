import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* Actions */
const INITIALIZE = 'form/INITIALIZE';
const CHANGE = 'form/CHANGE';

/* action creators */
export const initialize = createAction(INITIALIZE);
export const change = createAction(CHANGE);


/* initialState */
const initialState = Map({
    register: Map({
        username: ''
    }),
    commentForm: Map({
        text: ''
    }),
});

/* reducers */
export default handleActions({
    [INITIALIZE]: (state, action) => {
        // Initialize a certain form
        const formName = action.payload;
        const initialForm = initialState.get(formName);
        return state.set(formName, initialForm);
    },
    [CHANGE]: (state, action) => {
        const { formName, name, value } = action.payload;
        return state.setIn([formName, name], value);
    }
}, initialState);
