// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useEffect, useState } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 
import { Layout, Row, Col, Form, Input, Button, Typography } from 'antd'; // bibliothèque d'interface graphique

// style
import 'antd/dist/antd.css';
import '../css/login.css';

// images
import Logo from '../images/logo-capsules.png';

//composants créés ailleurs et importés
import TopnavbarLogin from './navbarLogin.js'
import Footer from './footer.js'

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapDispatchToProps en bas de fichier)
function Login(props) {

  // Etats avec leurs valeurs initiales à l'inialisation du composant 
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [userExists, setUserExists] = useState(false)
  const [listErrorsSignin, setErrorsSignin] = useState([])
  const [listErrorsSignup, setErrorsSignup] = useState([])

  // au clic sur le bouton "Connexion", échange de données avec le back pour l'inscription de l'utilisateur
  var handleSubmitSignup = async () => {
    const data = await fetch('/sign-up', { // communication avec le back sur cette route 
      method: 'POST', // pour écrire des données en BDD
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}` // données envoyées au Back
    })

    const body = await data.json() // convertion des données reçues en objet JS (parsage)

    if (body.result === true) { // si l'échange avec la BDD a fonctionné alors...
      props.addToken(body.token) // envoi du token (identifiant de l'utilisateur) dans le Redux Store
      props.newMessage(body.newMessage) // envoi de l'indication de nouveau message dans le Redux Store
      setUserExists(true) // valeur true sur l'état indiquant qui l'utilisateur existe
      // sinon récupérer le tableau d'erreurs venu du back dans un état
    } else {  // sinon récupérer le tableau d'erreurs venu du back dans un état
      setErrorsSignup(body.error)
    }
  }


  // au clic sur le bouton "Connexion", échange de données avec le back pour la reconnexion de l'utilisateur
  var handleSubmitSignin = async () => {
    const data = await fetch('/sign-in', { // communication avec le back sur cette route 
      method: 'POST', // recommandé pour échanger des informations sensibles avec le backend
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}` // données envoyées au Back
    })

    const body = await data.json() // convertion des données reçues en objet JS (parsage)
    if (body.result === true) { // si l'échange avec la BDD a fonctionné alors...
      props.addToken(body.token) // envoi du token (identifiant de l'utilisateur) dans le Redux Store
      props.newMessage(body.newMessage) // envoi de l'indication de nouveau message dans le Redux Store
      props.notifActivation(body.notifications) // envoi du paramètre d'activation de notification par email dans le Redux Store
      setUserExists(true)
    } else {
      // sinon récupérer le tableau d'erreurs venu du back dans un état
      setErrorsSignin(body.error)
    }
  }

  // si l'utilisateur existe en BDD, le rediriger vers la page de recherche de capsules
  if ((userExists && listErrorsSignup.length == 0) || (userExists && listErrorsSignin.length == 0)) {
    return <Redirect to='/research' />
  }

  // mise en forme des titres via antd
  const { Title } = Typography;

  // messages de non conformité du texte saisi dans le formulaire ant design
  const validateMessages = {
    required: 'Saisissez votre ${label}',
    types: {
      email: 'Arobase et extension nécessaires',
    },
    string: {
      min: '8 caractères de 4 types minimum',
    },
  };

  // messages d'erreurs rencontrées en back-end lors de l'identification mis en forme
  var tabErrorsSignin = listErrorsSignin.map((error, i) => {
    return (<p className="erreurs">
      {error}
    </p>
    )
  })

  // messages d'erreurs rencontrées en back-end lors de l'enregistrement mis en forme
  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return (<p key={i} className="erreurs">
      {error}
    </p>
    )
  })



  return (
    // le style de la page de login est dans css/login.css

    <Layout className="loginLayout">

      <TopnavbarLogin />

      <Row className="loginRow">
        <Col className="loginColImg">
          <img
            src={Logo}
            alt="Les capsules, site d'échange de capsules"
            width="100%"
          />
        </Col>
      </Row>

      <Row className="loginRow">
        <Col className="loginColSlog">
          <h4>Vous cherchez à échanger vos capsules de bière ou à agrandir votre collection ?
                <br></br>
                Inscrivez-vous et partagez votre passion avec des gens du monde entier.
          </h4>
        </Col>
      </Row>

      <Row className="loginRow">
        <Col className="loginColForm">

          {/* formulaire de reconnexion*/}
          <Form
            validateMessages={validateMessages}
            name="basic"
            initialValues={{ remember: true }}
          >
            <div className="spaceLogin"></div>
            <Title level={6} className="title">
              Reconnexion
            </Title>
            <div className="spaceLogin"></div>
            <div className="spaceLogin"></div>
            <div className="spaceLogin"></div>
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
            <div className="spaceLogin"></div>
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

          {/* formulaire d'inscription*/}
          <Form
            validateMessages={validateMessages}
            name="basic"
            initialValues={{ remember: true }}
          >
            <div className="spaceLogin"></div>
            <Title level={6} className="title">
              Inscription
            </Title>
            <div className="spaceLogin"></div>
            <div className="spaceLogin"></div>
            <div className="spaceLogin"></div>
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
              { min: 8 },
              ]}
            >
              <Input.Password
                size="large"
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </Form.Item>
            <div className="spaceLogin"></div>
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

      <Footer />

    </Layout>

  );
}

// fonction d'envoi de données dans le Redux Store
function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({ type: 'addToken', token: token })
    },
    newMessage: function (newMessage) {
      dispatch({ type: 'changeStatus', newMessage: newMessage })
    },
    notifActivation: function (notif) {
      dispatch({ type: 'notifStatus', notif: notif })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login)
