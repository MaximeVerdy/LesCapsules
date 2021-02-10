// page affichée en cas d'absence de token trouvé


import React, {useEffect, useState} from 'react'
import {Redirect} from 'react-router-dom'
import {Layout, Row, Col} from 'antd';

// images
import Runner from '../images/Runner.png';

export default function NotLogged() {

    const [timeOff, setTimeOff] = useState(false)

    useEffect(() => {

        const timer = setTimeout(() => {setTimeOff(true)}, 3000);

    },[])

    if(timeOff){
        return <Redirect to='/' />
    }    

    return (
  
        <Layout
            style = {{
                display: 'flex',
                placeContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'white',
            }}
        >


                <Row>
                    <Col
                        style = {{
                            marginBottom: '10px'
                        }}
                    >
                        <img 
                            src={Runner} 
                            alt="joggeuse" 
                            width="180px" 
                        />
                    </Col>
                </Row>



                <Row>
                    <h3>Il faut être connecté pour accéder à cette page</h3>
                </Row>



        </Layout>
  
    );
  }
  