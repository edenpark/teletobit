import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class FeedContainer extends Component {

    render() {
        const { children } = this.props;
        return(
            <div className="editor-wrapper">
                { children }
            </div>
        );
    }
}

export default FeedContainer;
