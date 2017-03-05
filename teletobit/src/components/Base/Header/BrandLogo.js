import React from 'react';
import { Link } from 'react-router';

class BandLogo extends React.Component {

    render() {
        return (
            <div className="brand-logo">
                <Link to='/'>
                    <img src="/favicon.ico" alt="톨레토빗 로고"/>
                    teletobit
                </Link>
            </div>
        );
    }

}

export default BandLogo;
