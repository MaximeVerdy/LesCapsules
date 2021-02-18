// page affichée en cas d'absence de token trouvé


import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Layout, Row, Col } from 'antd';


// style
import '../css/other.css';

// images
import Logo from '../images/logo-capsules.png';

export default function NotLogged() {

    const [timeOff, setTimeOff] = useState(false)

    useEffect(() => {

        const timer = setTimeout(() => { setTimeOff(true) }, 1000);

    }, [])

    if(timeOff){
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
                <h3>Vous devez être connecté.e pour accéder à</h3>
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
