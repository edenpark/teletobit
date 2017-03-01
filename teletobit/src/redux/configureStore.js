import { createStore, applyMiddleware, combineReducers } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

/* Load modules */
import base from './modules/base';
import form from './modules/form';
import register from './modules/register';
import main from './modules/main';
import editor from './modules/editor';
import posts from './modules/posts';
import single from './modules/single';
import profile from './modules/profile';
import admin from './modules/admin';

/* Configure middleware */
const middlewares = [promiseMiddleware()];

const createStoreWithMiddleware = applyMiddleware( ...middlewares)(createStore);

/* Combine the reducers */
const reducer = combineReducers({
    base,
    form,
    register,
    main,
    editor,
    posts,
    single,
    profile,
    admin
});

const configureStore = (initialState) => createStoreWithMiddleware(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default configureStore;
