import React from 'react';
import { Link } from 'react-router-dom'

import '../css/footer.css';

export default function Footer() {

    return (

        <div className="footer">
            <Link to="/MentionsLegales">
                <p style={{
                    color: 'grey',
                }}>
                    Mentions légales
            </p>
            </Link>
        </div>

    )
}
