import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Modal } from 'antd'

// style
import 'antd/dist/antd.css';
import '../css/navbar.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'


// images
import logo from '../images/logo-capsules.png';
import capsule from '../images/capsule.png';


function Topnavbar(props) {

  // Etats
  const [newMessage, setnewMessage] = useState(props.newMessage)
  const [token, settoken] = useState(props.token)  // état du token, récupéré du Redux Store


  
  useEffect(() => {
    const findNewMessage = async () => {
      const data = await fetch(`/notification-message?token=${token}`)  // pour récupérer des données 
      const body = await data.json() // convertion des données reçues en objet JS (parsage)
      setnewMessage(body.notification)
    }
    findNewMessage()
  }, [newMessage, props])


  const handleModalNoAccess = () => {
    Modal.warning({
      content: 'Vous devez d\'abord vous connecter'
    });
  }

  return (

    <div className="sticky">
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: 10,
        }}
      >
        <img className="hiddenLogoMenu"
          src={logo}
          alt="Les Capsules"
          height="42px"
        />
        <img className="showIfSmall"
          src={capsule}
          alt="une capsule"
          height="42px"
        />
      </div>

      <Menu className="menu" style={{ textAlign: 'center' }} mode="horizontal" >

        <Menu.Item key="research" id="rubric">
          <Link to="/research">
            <div style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faSearch} size="lg" />
              <span className="text hiddenTextMenu"> Recherche</span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="favorites" id="rubric">
          {token != '' &&
            <Link to="/favorites">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faHeart} size="lg" />
                <span className="text hiddenTextMenu"> Favoris</span>
              </div>
            </Link>
          }
          {token == '' &&
            <div style={{ color: 'grey' }}
              onClick={() => handleModalNoAccess()}
            >
              <FontAwesomeIcon icon={faHeart} size="lg" />
              <span className="text hiddenTextMenu"> Favoris</span>
            </div>

          }
        </Menu.Item>

        <Menu.Item key="ajout" id="rubric">
          {token != '' &&
            <Link to="/addcapsule">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" />
                <span className="text hiddenTextMenu"> Ajout</span>
              </div>
            </Link>
          }
          {token == '' &&

            <div style={{ color: 'grey' }}
              onClick={() => handleModalNoAccess()}
            >
              <FontAwesomeIcon icon={faPlusCircle} size="lg" />
              <span className="text hiddenTextMenu"> Ajout</span>
            </div>
          }
        </Menu.Item>

        <Menu.Item key="collection" id="rubric">
          {token != '' &&
            <Link to="/mycollection">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faCoins} size="lg" />
                <span className="text hiddenTextMenu"> Ma Collection </span>
              </div>
            </Link>
          }
          {token == '' &&
            <div style={{ color: 'grey' }}
              onClick={() => handleModalNoAccess()}
            >
              <FontAwesomeIcon icon={faCoins} size="lg" />
              <span className="text hiddenTextMenu"> Ma collection </span>
            </div>

          }
        </Menu.Item>

        <Menu.Item key="messages" id="rubric">
          {token != '' && newMessage == true &&
            <Link to="/messages">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon className="notificationMessage" icon={faEnvelope} size="lg" />
                <span className="text hiddenTextMenu"> Messages </span>
              </div>
            </Link>
          }
          {token != '' && newMessage == false &&

            <Link to="/messages">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                <span className="text hiddenTextMenu"> Messages </span>
              </div>
            </Link>
          }

          {token == '' &&
            <div style={{ color: 'grey' }}
              onClick={() => handleModalNoAccess()}
            >
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
              <span className="text hiddenTextMenu"> Messages </span>
            </div>
          }

        </Menu.Item>

      </Menu>

      <div
        style={{
          position: 'absolute',
          top: 1,
          right: 0,
          paddingRight: '10px',
          paddingTop: '10px',
        }}
      >
        {token == '' &&
          <Link to="/">
            <FontAwesomeIcon icon={faPowerOff} size="lg" color="black" />
            <span className="text hiddenTextMenu" style={{ color: 'black' }}> Connexion </span>
          </Link>
        }
        {token != '' &&
          <Link to="/disconnected">
            <FontAwesomeIcon icon={faPowerOff} size="lg" color="black" />
            <span className="text hiddenTextMenu" style={{ color: 'black' }}> Déconnexion </span>
          </Link>
        }
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    token: state.token,
    newMessage: state.newMessage
  }
}

export default connect(
  mapStateToProps,
  null
)(Topnavbar)