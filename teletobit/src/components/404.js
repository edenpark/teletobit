import React from 'react';
import Container from 'components/Common/Container';
import { Grid } from 'semantic-ui-react';

const UhOh = ({children}) => {
    return(
        <Container className="404">
            <Grid columns="equal">
                {children}
            </Grid>
        </Container>
    );
};

export { default as LeftColumn } from 'components/Common/Column/LeftColumn';
export { default as CenterColumn } from 'components/Common/Column/CenterColumn';
export { default as RightColumn } from 'components/Common/Column/RightColumn';

export default UhOh;
