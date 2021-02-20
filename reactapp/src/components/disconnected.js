// page affichée en cas de déconnexion volontaire

// importation à partir de libraries
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Row, Col } from 'antd';

// style
import '../css/other.css';

// images
import Logo from '../images/logo-capsules.png';

function Disconnected(props) {

    // Etat
    const [timeOff, setTimeOff] = useState(false)

    useEffect(() => {
        props.addToken('')
        const timer = setTimeout(() => { setTimeOff(true) }, 2500);
    }, [])

    if (timeOff) {
        return <Redirect to='/' />
    }

    return (

        <Layout className="researchLayout"
            style={{
                placeContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >

            <Row
                style={{
                    marginTop: '-120px'
                }}
            >
                <h3>Vous êtes déconnecté.e. A bientôt sur </h3>
            </Row>

            <Row>
                <Col
                    style={{
                        marginTop: '30px'
                    }}
                >
                    <img
                        src={Logo}
                        alt="Logo Les Capsules"
                        width="600px"
                    />
                </Col>
            </Row>
        </Layout>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        addToken: function (token) {
            dispatch({ type: 'addToken', token: token })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Disconnected)