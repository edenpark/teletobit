import React, { Component, PropTypes } from 'react';
import onClickOutside from 'react-onclickoutside';

class Content extends Component {

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUpdate(nextProps, nextState) {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if(e.keyCode === 27) {
            const { hide } = this.props;
            hide();
        }
    }

    render() {
        const { children } = this.props;
        return children;
    }

    handleClickOutside = () => {
        this.props.hide();
    }

}

Content = onClickOutside(Content);

class EyeCatchy extends Component {

    handleHide = () => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { children } = this.props;
        const { handleHide } = this;

        return (
            <Content hide={handleHide}>
                {children}
            </Content>
        )
    }
}

EyeCatchy.propTypes = {
    onHide: PropTypes.func
}

export default EyeCatchy;
