import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import '../css/footer.css';

function Footer(props) {

    return (

        <div >
            {props.token != '' &&
                <div className="footer1">
                    <Link to="/parameters">
                        <p style={{
                            color: 'grey',
                        }}>
                            Paramètres
                      </p>
                    </Link>
                </div>
            }
            <div className="footer2">
                <Link to="/MentionsLegales">
                    <p style={{
                        color: 'grey',
                    }}>
                        Mentions légales
                    </p>
                </Link>
            </div>
        </div>

    )
}

function mapStateToProps(state) {
    return {
        token: state.token,
    }
}

export default connect(
    mapStateToProps,
    null
)(Footer)