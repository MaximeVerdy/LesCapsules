// page affichée en cas de déconnexion volontaire

import React, {useEffect, useState} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Row, Col} from 'antd';

// images
import Runner from '../images/Runner.png';

function Disconnected(props) {

    const [timeOff, setTimeOff] = useState(false)

    useEffect(() => {

        props.addToken('')

        const timer = setTimeout(() => {setTimeOff(true)}, 3500);

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
                    <h3>Vous avez été correctement déconnecté.e. A bientôt !</h3>
                </Row>



        </Layout>
  
    );
  }
  
  function mapDispatchToProps(dispatch){
    return {
      addToken: function(token){
        dispatch({type: 'addToken', token: token})
      }
    }
  }
  
  export default connect(
    null,
    mapDispatchToProps
  )(Disconnected)