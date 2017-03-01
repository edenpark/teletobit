import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'containers/Root';

import firebaseHelper from 'helpers/firebase';

// redux
import configureStore from 'redux/configureStore';

firebaseHelper.initialize();

const store = configureStore();
const rootElement = document.getElementById('root')

/**
    This is for getting host url to use react-router
    Instead of using browserHistory
    import { browserHistory } from 'react-router'
**/
import { createHistory, useBasename } from 'history';
function getWindowPath() {
    return window.location.origin;
}
const history = useBasename(createHistory)({
  basename: getWindowPath()
})


ReactDOM.render(
    <Root store={store}
        history={history} />, rootElement
);
