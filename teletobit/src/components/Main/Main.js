import React from 'react';
import Container from 'components/Common/Container';
import { Grid } from 'semantic-ui-react';

const Main = ({children}) => {
    return(
        <Container className="main">
            <Grid columns="equal">
                {children}
            </Grid>
        </Container>
    );
};

export { default as LeftColumn } from 'components/Common/Column/LeftColumn';
export { default as CenterColumn } from 'components/Common/Column/CenterColumn';
export { default as RightColumn } from 'components/Common/Column/RightColumn';


// Center columns
export { default as Write } from './Editor/Write';
export { default as Editor } from './Editor/Editor';
export { default as Posts } from './Post/Posts';
export { default as Post } from './Post/Post';

export default Main;
