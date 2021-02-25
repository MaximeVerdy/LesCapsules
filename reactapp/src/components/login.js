// importation à partir de libraries
import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {Layout, Row, Col, Form, Input, Button, Typography} from 'antd';
import {connect} from 'react-redux'

// style
import 'antd/dist/antd.css';
import '../css/login.css';

// images
import Logo from '../images/logo-capsules.png';

// composants
import TopnavbarLogin from './navbarLogin.js'
import Footer from './footer.js'


function Login(props) {

// liste des états utilisés dans le composant Sign
const [signUpEmail, setSignUpEmail] = useState('')
const [signUpPassword, setSignUpPassword] = useState('')
const [signInEmail, setSignInEmail] = useState('')
const [signInPassword, setSignInPassword] = useState('')
const [userExists, setUserExists] = useState(false)
const [listErrorsSignin, setErrorsSignin] = useState([])
const [listErrorsSignup, setErrorsSignup] = useState([])

// échange de données avec le back pour l'inscription par fonction asynchrone. le await indique qu'il faut attendre le retour des données pour terminer la fonction
var  handleSubmitSignup = async () => {
    
  const data = await fetch('/sign-up', {
    method: 'POST', // pour écrire des données en BDD
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`
  })

  // convertion des données reçues en objet JS (parsage)
  const body = await data.json()

  // si l'échange avec la BDD a fonctionné, envoie du token dans le Redux Store
  if(body.result === true){
    props.addToken(body.token)
    props.newMessage(body.newMessage)
    setUserExists(true)
  // sinon récupérer le tableau d'erreurs venu du back
  } else {
    setErrorsSignup(body.error)
  }
}


// échange de données avec le back pour la reconnexion
var handleSubmitSignin = async () => {

  const data = await fetch('/sign-in', {
    method: 'POST', // recommandé pour échanger des informations sensibles avec le backend
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`
  })

  // convertion des données reçues en objet JS (parsage)
  const body = await data.json()

    // si l'échange avec la BDD a fonctionné, envoie du token dans le Redux Store
  if(body.result === true){
    props.addToken(body.token)
    props.newMessage(body.newMessage)
    props.notifActivation(body.notifications)
    setUserExists(true)
  }  else {
      // sinon récupérer le tableau d'erreurs venu du back
    setErrorsSignin(body.error)
  }
}

// si l'utilisateur existe en BDD, le rediriger vers la page de statistiques
if((userExists && listErrorsSignup.length == 0) || (userExists && listErrorsSignin.length == 0)){
  return <Redirect to='/research' />
}

// mise en forme des titres antd
const { Title } = Typography;

// messages de non conformité pour les formulaires antd
const validateMessages = {
  required: 'Saisissez votre ${label}',
  types: {
    email: 'Arobase et extension nécessaires',
  },
  string: {
    min: '8 caractères de 4 types minimum',
  },
};

// messages d'erreurs rencontrées en back-end lors de l'identification
var tabErrorsSignin = listErrorsSignin.map((error,i) => {
  return( <p className= "erreurs">
            {error}
          </p>
        )
})

// messages d'erreurs rencontrées en back-end lors de l'enregistrement
var tabErrorsSignup = listErrorsSignup.map((error,i) => {
  return( <p key={i} className= "erreurs">
            {error}
          </p>
        )
})



  return (
    // le style de la page de login est dans css/login.css

    <Layout className= "loginLayout"> 

 <TopnavbarLogin />

              <Row className="loginRow">
                  <Col className="loginColImg">
                      <img 
                          src={Logo} 
                          alt="Stats et Running fusionnés" 
                          width="100%" 
                      />
                  </Col>
              </Row>

              <Row className="loginRow">
                  <Col className="loginColSlog">
                    <h4>Vous cherchez à échanger vos capsules de bière ou à agrandir votre collection ? <br></br> Inscrivez-vous et partagez votre passion avec des gens du monde entier.</h4>
                  </Col>
              </Row>

              <Row className="loginRow">
                  <Col className="loginColForm">

                        <Form 
                          validateMessages= {validateMessages}
                          name="basic"
                          initialValues={{ remember: true }}
                        >

                          <Title level={6} className="title">
                            Reconnexion
                          </Title>

                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true }]}
                          >
                            <Input 
                              size="large"
                              // les charactères saisis sont mis dans l'état correspondant
                              onChange={(e) => setSignInEmail(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[{ required: true },
                            ]}
                          >
                            <Input.Password 
                              size="large"
                              // les charactères saisis sont mis dans l'état correspondant
                              onChange={(e) => setSignInPassword(e.target.value)}
                            />
                          </Form.Item>
                        
                          <Form.Item>
                            <Button type="primary" htmlType="submit" block className="button"
                              // au clic sur le bouton, handleSubmitSignin est déclanché et les données sont envoyés en back
                              onClick={() => handleSubmitSignin()}
                            >
                              Connexion
                            </Button>

                            {/* s'il y a des messages d'erreurs, il s'afficheront ici */}
                            {tabErrorsSignin}

                          </Form.Item>
                        </Form>
                        
                  </Col>

                  <Col className="loginColForm">

                        <Form
                          validateMessages={validateMessages}
                          name="basic"
                          initialValues={{ remember: true }}
                        >

                          <Title level={6}className="title">                          
                            Inscription
                          </Title>

                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ type: 'email', required: true }]}
                          >
                            <Input 
                              size="large"
                              onChange={(e) => setSignUpEmail(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[{ type: 'string', required: true }, 
                                    {min: 8},
                            ]}
                          >
                            <Input.Password 
                              size="large"
                              onChange={(e) => setSignUpPassword(e.target.value)}
                            />
                          </Form.Item>
                        
                          <Form.Item>
                            <Button type="primary" htmlType="submit" block className="button"
                              onClick={() => handleSubmitSignup()}
                            >
                              Connexion
                            </Button>

                            {tabErrorsSignup}

                          </Form.Item>
                        </Form>

                  </Col>

              </Row>

              <div className="endDiv"></div>

          <Footer/>
          
    </Layout>

  );
}

// fonction d'envoyer de données dans le Redux Store
function mapDispatchToProps(dispatch){
  return {
    addToken: function(token){
      dispatch({type: 'addToken', token: token})
    },
    newMessage: function(newMessage){
      dispatch({type: 'changeStatus', newMessage: newMessage})
    },
    notifActivation: function(notif) {
      dispatch ({type: 'notifStatus', notif : notif})
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login)
