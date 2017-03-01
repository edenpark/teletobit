import React from 'react';
import { Link } from 'react-router';

class BandLogo extends React.Component {

    render() {
        return (
            <div className="brand-logo">
                <Link to='/'>teletobit</Link>
            </div>
        );
    }

}

export default BandLogo;
