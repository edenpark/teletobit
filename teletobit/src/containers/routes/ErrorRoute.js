import React, { Component } from 'react';

import UhOh, {
    LeftColumn,
    CenterColumn,
    RightColumn,
} from 'components/404';

class ErrorRoute extends Component {

    render() {
        return(
            <UhOh>
                <LeftColumn/>
                <CenterColumn>
                    404
                </CenterColumn>
                <RightColumn/>
            </UhOh>
        );
    }
}

export default ErrorRoute;
