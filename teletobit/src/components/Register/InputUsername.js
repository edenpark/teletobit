import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

class InputUsername extends Component {
    render() {
        const { onClick, error, loading, value, onChange } = this.props;

        return(
            <div className="input-username">
                <Input
                    action={
                        {
                            color: 'teal',
                            icon: 'chevron right',
                            onClick,
                            disabled: error || value === '',
                            loading: loading.register
                        }
                    }
                    placeholder="아이디"
                    onChange={onChange}
                    value={value}
                    error={error}
                    loading={loading.checkUsername}
                    icon='user'
                    iconPosition='left'
                />
            </div>
        );
    }
}

export default InputUsername;
