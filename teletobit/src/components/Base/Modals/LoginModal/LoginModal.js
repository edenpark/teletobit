import React, { Component } from 'react'
import Dimmer from 'components/Common/Dimmer';
import EyeCatchy from 'components/Common/EyeCatchy';
import SocialLoginButton from './SocialLoginButton';

class LoginModal extends Component {
    state = {
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
        const { children, visible, onHide } = this.props;
        const { closing } = this.state;

        if(!closing && !visible) return null;

        const animation = closing ? 'flipOutX' : 'flipInX';

        return (
            <div>
                <div className="login-modal-wrapper">
                    <EyeCatchy onHide={onHide}>
                        <div ref={ref=>{this.modal=ref}} className={`login-modal ${animation}`}>
                            <div className="exit" onClick={onHide}>X</div>
                            <div className="logo">BitcoinNewsKR</div>
                            <div className="description">
                                <p><b>비트코인 유저</b>들을 위한 <b>한국어</b> 뉴스</p>
                                <p>여러분들과 함께 정보를 <b>나눔니다</b>.</p>
                            </div>
                            <div className="buttons-wrapper">
                                {children}
                            </div>
                        </div>
                    </EyeCatchy>
                </div>
                <Dimmer />
            </div>
        );
    }
}

LoginModal.SocialLoginButton = SocialLoginButton;
export default LoginModal;
