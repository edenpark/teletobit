import React from 'react';
import { Link } from 'react-router';
import { Header, Icon, Button, Divider } from 'semantic-ui-react';

const PostDeleted = () => {
    return(
        <div className="deleted-post-wrapper">
            <Header as='h2' icon>
                <Icon name='meh' />
                    삭제 된 포스트 입니다
                <Header.Subheader>
                    다른 글들을 읽으러 갈까요?
                </Header.Subheader>
            </Header>
            <Divider hidden/>
            <Link to="/">
                <Button
                    content='메인으로 가기'
                    color='pink'
                    icon='smile'
                    labelPosition='left'
                />
            </Link>
        </div>
    );
};

export default PostDeleted;
