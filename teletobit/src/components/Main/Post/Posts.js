import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Posts extends Component {

    render() {
        const { children } = this.props;
        return(
            <div className="posts-wrapper">
                {children}
            </div>
        );
    }
}

export default Posts;
