import React, { Component, PropTypes } from 'react'
import Dimmer from 'components/Common/Dimmer';
import EyeCatchy from 'components/Common/EyeCatchy';

class Modal extends Component {

    static propType = {
        onHide: PropTypes.func, // function to hide a modal
        visible: PropTypes.bool,
        className: PropTypes.string
    }

    state ={
        closing: false
    }

    componentDidUpdate(prevProps, prevState) {
        // when value is changed from 'false' to 'true',
        // set 'true' on 'closing'
        if(prevProps.visible && !this.props.visible ) {
            this.setState({
                closing: true
            });

            // then after 0.8s, set 'false' on 'closing'
            setTimeout(
                () => {
                    this.setState({
                        closing: false
                    })
                }, 700
            )
        }

    }
    render () {
        const { children, visible, onHide, className } = this.props;
        const { closing } = this.state;

        if(!closing && !visible) return null;

        const animation = closing ? 'flipOutX' : 'flipInX';

        return (
            <div>
                <div className="modal-wrapper">
                    <EyeCatchy onHide={onHide}>
                        <div className={`modal ${animation} ${className}`}>
                            {children}
                        </div>
                    </EyeCatchy>
                </div>
                <Dimmer />
            </div>
        );
    }
}

export default Modal;
