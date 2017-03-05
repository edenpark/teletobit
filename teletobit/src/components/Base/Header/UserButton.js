import React, { Component } from 'react';

class UserButton extends Component {

    state = {
        clickable: true
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.clickable) {
            console.log('hit2');
            this.setState({
                clickable: true
            })
            return;
        }

        console.log("prevState.clickable", prevState.clickable);
    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps.visible", nextProps.visible);
        console.log("this.props.visible", this.props.visible);

        // When usermenu is closing, UserButton is not clickable
        if(!nextProps.visible && this.props.visible) {
            console.log('hit');
            this.setState({
                clickable: false
            })
        }

    }
    render() {
        const { thumbnail, onShow, onHide } = this.props;
        const { clickable } = this.state;

        return(
            <div className="user-button" onClick={ clickable ? onShow : onHide }>
                <div className="thumbnail" style={{backgroundImage: `url(${thumbnail})`}}></div>
            </div>
        );
    }
}

export default UserButton;
