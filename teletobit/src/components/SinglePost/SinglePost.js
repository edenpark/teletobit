import React from 'react';
import Container from 'components/Common/Container';
import { Grid } from 'semantic-ui-react';

const SinglePost = ({children}) => {
    return(
        <Container className="main single-post-wrapper">
            <Grid columns="equal">
                {children}
            </Grid>
        </Container>
    );
};

export { default as LeftColumn } from 'components/Common/Column/LeftColumn';
export { default as CenterColumn } from 'components/Common/Column/CenterColumn';
export { default as RightColumn } from 'components/Common/Column/RightColumn';

export { default as Post } from './Post';
export { default as PostDeleted } from './PostDeleted';

export default SinglePost;
