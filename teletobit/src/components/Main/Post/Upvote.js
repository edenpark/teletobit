import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';


class Upvote extends Component {

    state = {
        upvoted: this.props.isUpvoted,
        updating: false
    }

    componentWillReceiveProps(nextProps) {


        const oldUpvoted = this.props.isUpvoted;
        const newUpvoted = nextProps.isUpvoted;

        if(oldUpvoted === newUpvoted) {
            return;
        }

        this.setState({
            updating: false,
            upvoted: newUpvoted
        });
    }


    onVote = () => {
        const { onUpvote, onDownvote, user, itemId, upvotes, openLoginModal } = this.props;
        const { upvoted, updating } = this.state;

        if(!user.getIn(['profile', 'username'])) {
            openLoginModal();
            return;
        }

        if(updating) {
            return;
        }

        if(upvoted) {
            onDownvote({
                itemId: itemId,
                upvotes: upvotes
            });
        } else {
            onUpvote({
                itemId: itemId,
                upvotes: upvotes
            });
        }

        this.setState({
            upvoted: !upvoted,
            updaing: true
        })

    }

    render() {
        const { upvotes } = this.props;
        const { onVote } = this;
        const { upvoted } = this.state;

        const color = upvoted ? 'teal' : 'grey'

        return(
            <span className="post-info-item upvote">
                <Icon
                    name='empty heart'
                    color={color}
                    size='large'
                    onClick={onVote}
                />
                <span>{upvotes}</span>
            </span>
        );
    }
}

export default Upvote;
