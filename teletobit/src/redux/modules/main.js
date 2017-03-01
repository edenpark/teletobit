import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* Actions */
const SORTER_SET = 'main/SORTER_SET';

/* action creators */
export const setSorter = createAction(SORTER_SET);

/* initialState */
const initialState = Map({
    sorter: Map({
        value: 'recent'
    }),
});

/* reducers */
export default handleActions({
    [SORTER_SET]: (state, action) => {
        const value = action.payload;
        return state.setIn(['sorter', 'value'], value)
    }
}, initialState);
