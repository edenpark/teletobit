import { handleActions, createAction } from 'redux-actions';
import { Map } from 'immutable';
import Request, { requize, pend, fulfill, reject } from 'helpers/request';
import users from 'helpers/firebase/database/users';

/* Actions */
const USERNAME_CHECK = requize('register/USERNAME_CHECK');
const REGISTER = requize('register/REGISTER');
const SET_VALIDITY = 'register/SET_VALIDITY';

/* action creators */
export const checkUsername = (username) => ({
    type: USERNAME_CHECK.DEFAULT,
    payload: {
        promise: users.checkUsername(username)
    }
});

export const register = ({uid, username, displayName, email, thumbnail}) => ({
    type: REGISTER.DEFAULT,
    payload: {
        promise: users.create({uid, username, displayName, email, thumbnail}),
    }
});

export const setValidity = createAction(SET_VALIDITY);

/* initialState */
const initialState = Map({
    requests: Map({
        checkUsername: Request(),
        claimUsername: Request(),
        register: Request(),
    }),
    validation: Map({
        valid: true,
        message: ''
    })
});

/* reducers */
export default handleActions({
    // Check username
    [USERNAME_CHECK.PENDING]: (state, action) => {
        return pend(state, 'checkUsername');
    },
    [USERNAME_CHECK.FULFILLED]: (state, action) => {
        return fulfill(state, 'checkUsername');
    },
    [USERNAME_CHECK.REJECT]: (state, action) => {
        const error = action.payload;
        return reject(state, 'checkUsername', error);
    },

    // Register
    [REGISTER.PENDING]: (state, action) => {
        return pend(state, 'register');
    },
    [REGISTER.FULFILLED]: (state, action) => {
        return fulfill(state, 'register');
    },
    [REGISTER.REJECT]: (state, action) => {
        const error = action.payload;
        return reject(state, 'register', error);
    },

    [SET_VALIDITY]: (state, action) => {
        const { valid, message } = action.payload;

        return state.mergeIn(['validation'], {
            valid,
            message: (!message) ? '' : message
        });
    }

}, initialState);
