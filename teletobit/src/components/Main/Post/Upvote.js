import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';


class Upvote extends Component {
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

    state = {
        upvoted: this.props.isUpvoted,
        updating: false
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

        const color = upvoted ? 'pink' : 'grey'

        return(
            <span className="post-info-item upvote">
                <Button
                    icon='thumbs up'
                    color={color}
                    content={` ${upvotes}`}
                    size='mini'
                    onClick={onVote}
                />
            </span>
        );
    }
}

export default Upvote;
