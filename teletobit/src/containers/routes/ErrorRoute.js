import React, { Component } from 'react';

import UhOh, {
    LeftColumn,
    CenterColumn,
    RightColumn,
} from 'components/UhOh';

import { Header, Icon } from 'semantic-ui-react'

class ErrorRoute extends Component {

    render() {
        return(
            <UhOh>
                <LeftColumn/>
                <CenterColumn>
                    <div className="error-wrapper">
                        <Header as='h1' icon textAlign='center'>
                            <Icon name='warning' circular />
                            <Header.Content>
                               404
                            </Header.Content>
                            <Header.Subheader>
                                존재하지 않는 페이지입니다
                            </Header.Subheader>
                        </Header>
                    </div>
                </CenterColumn>
                <RightColumn/>
            </UhOh>
        );
    }
}

export default ErrorRoute;
