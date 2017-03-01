import React from 'react';
import Modal from 'components/Common/Modal';
import { Icon, Button } from 'semantic-ui-react';

const LinkAccountModal = ({ onHide, visible, existingProvider, provider, onLinkAccount }) => {
    return(
        <Modal onHide={onHide}
                visible={visible}
                className="link-account-modal">
            <div className="title-bar">
                <Icon fitted name="exclamation triangle" />
            </div>
            <div className="message">
                <p><b>{existingProvider}</b> 계정으로 이미 가입하셨습니다.</p>
                <p><b>{provider}</b> 계정과 연동하시겠습니까?</p>
                <p className="warning">* <b>'아니오'</b> 를 누르시면 로그인이 취소됩니다.</p>
            </div>
            <div className="footer">
                <Button color="teal" onClick={onLinkAccount}>예</Button>
                <Button color="red" onClick={onHide}>아니오</Button>
            </div>
        </Modal>
    );
};

export default LinkAccountModal;
