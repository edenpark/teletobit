import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modal from 'redux/modules/base/modal';
import * as authAction from 'redux/modules/base/auth';
import * as header from 'redux/modules/base/header';

// Load components
import Header, {
    BrandLogo,
    AuthButton,
    UserButton,
    UserMenu
}  from 'components/Base/Header/Header';
import Footer from 'components/Base/Footer/Footer';

import * as Modals from 'components/Base/Modals';
const { LoginModal, LinkAccountModal } = Modals;
const { SocialLoginButton } = LoginModal;

import auth from 'helpers/firebase/auth';
import users from 'helpers/firebase/database/users';
import storage from 'helpers/storage';

import Helmet from 'react-helmet';
import 'styles/main.scss';

class App extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    };

    profileRef = null

    componentWillMount() {
        // Bring a profile from localStorage
        const { AuthActions } = this.props;
        const profile = storage.get('profile');

        if(profile) {
            AuthActions.syncProfile(profile);
        }
    }


    componentDidMount() {
        // Listner to verify an account
        auth.authStateChanged(
            async (firebaseUser) => {

                // Stop syncing exsiting profile
                if(this.profileRef) {
                    this.profileRef.off();
                    this.profileRef = null;
                }
                const { AuthActions } = this.props;

                if(firebaseUser) {
                    AuthActions.authenticate(firebaseUser);
                    this.profileRef = users.findProfileByIdSync(firebaseUser.uid, (snapshot) => {
                        const profile = snapshot.val();

                        // Sync the profile
                        AuthActions.syncProfile(profile);

                        // Store the profile to the localStorage
                        storage.set('profile', profile);

                    })
                }
            }
        );

    }

    handleAuth = async (provider) => {
        this.handleModal.close('login');
        try {
            const loginData = await auth.signInWithPopup(provider);
            // Check if it's exisiting user
            const uid = loginData.user.uid;
            const profile = await users.findProfileById(uid);

            if(!profile.exists()) {
                this.context.router.push('/register');
            }
        } catch (e) {
            // Error incurred when account exists
            if(e.code === 'auth/account-exists-with-different-credential') {
                console.log(e.code);
                // Find an exisiting accout provider
                const existingProvider = await auth.getExistingProvider(e.email)

                // Display a modal to link to exisiting account
                this.handleModal.open({
                    modalName: 'linkAccount',
                    data: {
                        credential: e.credential,
                        provider,
                        existingProvider
                    }
                });
            }

        }

    }

    handleModal = (() => {
        const { ModalActions } = this.props;
        return {
            open: ({modalName, data}) => {
                ModalActions.openModal({modalName, data});
            },
            close: (modalName) => {
                ModalActions.closeModal(modalName);
            }
        }
    })()

    handleUserMenu = (() => {
        const { HeaderActions } = this.props;
        return {
            open: () => {
                HeaderActions.openUserMenu();
            },
            close: () => {
                HeaderActions.closeUserMenu();
            }
        }
    })()

    handleLinkAccount = async () => {
        const { status : { modal } }  = this.props;
        const credential = modal.getIn(['linkAccount', 'credential']);
        const provider = modal.getIn(['linkAccount', 'existingProvider']);

        await auth.linkAccount({credential, provider});
        this.handleModal.close('linkAccount');
    }

    handleLogOut = () => {
        const { AuthActions, HeaderActions } = this.props;
        auth.logout();
        storage.remove('profile');
        AuthActions.logout();
        HeaderActions.closeUserMenu();
    }

    render() {
        const { children, status: { modal, profile, header } } = this.props;
        const { handleModal, handleAuth, handleLinkAccount, handleUserMenu, handleLogOut } = this;
        const canonical_url = document.location.origin;
        return(
            <div>
                {
                    <Helmet
                        htmlAttributes={{lang: "ko", amp: undefined}}
                        title={`텔레토빗 - 세계 비트코인 뉴스`}
                        defaultTitle={`텔레토빗 - 세계 비트코인 뉴스`}
                        titleAttributes={{itemprop: "name", lang: "ko"}}
                        base={{target: "_blank", href: canonical_url}}
                        meta={[
                            {
                                name: "description",
                                content: `세계 비트코인 뉴스 제목/머릿글을 한국어로 번역하는 서비스를 제공하고
                                        정보를 공유하고 생각을 나누는 곳 입니다`
                            },
                            {property: "og:type", content: "article"}
                        ]}
                        link={[
                            {rel: "canonical", href: canonical_url},
                        ]}
                    />
                }
                <div id="wrap">
                    <Header visible={header.get('visible')}>
                        <BrandLogo />
                        {
                            profile.get('username')
                            ?  <UserButton
                                    thumbnail={profile.get('thumbnail')}
                                    onShow={handleUserMenu.open}
                                />
                            :  <AuthButton onClick={() => handleModal.open({modalName: 'login'})}/>
                        }
                        <UserMenu
                            visible={header.getIn(['userMenu', 'open'])}
                            onHide={handleUserMenu.close}
                            profile={profile}
                            onLogOut={handleLogOut}
                        />
                    </Header>
                    <LoginModal visible={modal.getIn(['login', 'open'])}
                                onHide={() => handleModal.close('login')}>
                        <SocialLoginButton onClick={() => handleAuth('google')} type="google"/>
                        <SocialLoginButton onClick={() => handleAuth('facebook')} type="facebook"/>
                    </LoginModal>
                    <LinkAccountModal
                        visible={modal.getIn(['linkAccount', 'open'])}
                        onHide={() => handleModal.close('linkAccount')}
                        existingProvider={modal.getIn(['linkAccount', 'existingProvider'])}
                        provider={modal.getIn(['linkAccount', 'provider'])}
                        onLinkAccount={handleLinkAccount}
                    />
                    {children}
                </div>
                <Footer />
            </div>
        );
    }
}

App = connect(
    state => ({
        status: {
            header: state.base.header,
            modal: state.base.modal,
            profile: state.base.auth.get('profile')
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(header, dispatch),
        ModalActions: bindActionCreators(modal, dispatch),
        AuthActions: bindActionCreators(authAction, dispatch)
    })
)(App);

export default App;
