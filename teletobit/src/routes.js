import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from 'containers/App';
import {
    MainRoute,
    RegisterRoute,
    SinglePostRoute,
    ErrorRoute,
    ProfileRoute,
    AdminRoute
} from 'containers/routes';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={MainRoute} />
        <Route path="register" component={RegisterRoute} name="register "/>
        <Route path="post/:postId" component={ SinglePostRoute } name="post" />
        <Route path="profile/:username" component={ ProfileRoute } name="profile" />
        <Route path="404" component={ ErrorRoute } name="404" />
        <Route path="admin" component={ AdminRoute } name="admin" />
        <Redirect from="*" to="404" name="404" />
    </Route>
);
