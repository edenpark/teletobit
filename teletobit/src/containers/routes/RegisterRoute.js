import React, { Component } from 'react';
import Register, {
    TitleBar,
    Content,
    InputUsername,
    PreviousButton,
    Loader

} from 'components/Register/Register';
import { connect } from 'react-redux';
import * as register from 'redux/modules/register';
import * as form from 'redux/modules/form';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';

import { Message } from 'semantic-ui-react';
class RegisterRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    constructor(props) {
        super(props);

        // Limit a request every 500ms
        this.handleCheckUsername = debounce(this.handleCheckUsername, 500);
    }

    componentDidMount() {
        const { FormActions } = this.props;
        FormActions.initialize('register');
    }

    componentDidUpdate(prevProps, prevState) {
        const { status: { auth } } = this.props;

        // Redirect to index page if it created a profile
        if(auth.getIn(['profile', 'username'])){
            console.log(auth.getIn(['profile', 'username']));
            this.context.router.push('/');
        }

    }

    // No need to handle input form in redux
    handleChange = (e) => {
        const { FormActions } = this.props;
        const value = e.target.value;
        FormActions.change({
            formName: 'register',
            name: 'username',
            value
        });

        this.handleValidate(value);
    }


    handleRegister = async () => {
        const { status : { auth }, form } = this.props;

        const username = form.usernameValue;

        const user = auth.get('user');

        const { RegisterActions } = this.props;

        const { uid, photoURL, displayName, email } = user;


        try {

            await RegisterActions.register({
                uid,
                username,
                displayName,
                email,
                thumbnail: photoURL
            });

            this.context.router.push('/');

        } catch (e) {

            /* Check if user has a profile
                If exists, redirect
            */

            // Initialize the input
            const { FormActions } = this.props;

            FormActions.change({
                formName: 'register',
                name: 'username',
                value: ''
            });

            RegisterActions.setValidity({
                valid: false,
                message: '알 수 없는 에러가 발생했습니다. 다시 시도해주세요'
            });

        }


    }

    handleValidate = (username) => {
        const { RegisterActions} = this.props;
        const regex = /^[가-힣]|[a-zA-Z0-9_]{2,20}$/;

        if(!regex.test(username)) {
            RegisterActions.setValidity({
                valid: false,
                message: '한글, 영문 소문자, 영문 대문자, 숫자와 밑줄(_)로 시작해야 합니다. 2-20자'
            });
            return;
        } else {
            RegisterActions.setValidity({
                valid: true,
                message: ''
            });
        }

        this.handleCheckUsername(username);

    }

    handleCheckUsername = async (username) => {
        const { RegisterActions } = this.props;

        const result = await RegisterActions.checkUsername(username);
        if(!result.value.available) {
            RegisterActions.setValidity({
                valid: false,
                message: '이미 사용중인 이름입니다.'
            });
        } else {
            RegisterActions.setValidity({
                valid: true,
                message: ''
            });
        }

    }

    render() {
        const { handleRegister, handleValidate, handleChange } = this;
        const { status: { validation, loading, auth }, form: { value } } = this.props;

        return(
            <Register>
                <TitleBar>
                    <PreviousButton />
                </TitleBar>
                <Content>
                    <InputUsername
                        onClick={handleRegister}
                        onValidate={handleValidate}
                        error={ validation.get('valid') === false}
                        loading={loading}
                        onChange={handleChange}
                        value={value}
                    />
                {
                    !validation.get('valid') && (
                        <Message color="red">
                            { validation.get('message') }
                        </Message>
                    )
                }
                <Loader visible={!auth.get('profileSynced')} />
                </Content>
            </Register>
        );
    }
}

RegisterRoute = connect(
    state => ({
        status: {
            auth: state.base.auth,
            validation: state.register.get('validation'),
            loading: {
                checkUsername: state.register.getIn(['requests', 'checkUsername', 'fetching']),
                register: state.register.getIn(['request', 'register', 'fetching']),
            }
        },
        form: {
            usernameValue: state.form.getIn(['register', 'username'])
        }
    }),
    dispatch => ({
        RegisterActions: bindActionCreators(register, dispatch),
        FormActions: bindActionCreators(form, dispatch)
    })
)(RegisterRoute);

export default RegisterRoute;
