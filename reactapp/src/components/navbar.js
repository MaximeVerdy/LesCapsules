// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useState, useEffect } from 'react'; // bibliothèque de création de composants
import { Link } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 
import { Menu, Modal } from 'antd' // bibliothèque d'interface graphique

// style
import 'antd/dist/antd.css';
import '../css/navbar.css';

// icônes utilisées dans le composant
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

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapStateToProps en bas de fichier)
function Topnavbar(props) {

  // Etats avec leurs valeurs initiales à l'inialisation du composant 
  const [newMessage, setnewMessage] = useState(props.newMessage) // valeur de l'indictateur de nouveau message récupéré du Redux Store
  const [token, settoken] = useState(props.token)  // valeur du token récupéré du Redux Store



  useEffect(() => { // le hook d'effet se déclenchera à chaque mise à jour de newMessage ou props 
    const findNewMessage = async () => {
      const data = await fetch(`/notification-message?token=${token}`)  // pour lire des données en base de données avec méthode GET. la route utilisée et les données envoyées en back après le ? 
      const body = await data.json() // convertion des données reçues en objet JS (parsage)
      setnewMessage(body.notification)
    }
    findNewMessage()  // appel de la fonction
  }, [props])

  // en cas de clic sur un bouton non autorisé quand l'utilisateur n'est pas connecté un popup d'avertissement s'ouvre
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
          {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
          {token != '' &&
            <Link to="/favorites">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faHeart} size="lg" />
                <span className="text hiddenTextMenu"> Favoris</span>
              </div>
            </Link>
          }

          {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
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
          {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
          {token != '' &&
            <Link to="/addcapsule">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" />
                <span className="text hiddenTextMenu"> Ajout</span>
              </div>
            </Link>
          }
          {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
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
          {/* ce qui s'affiche quand l'utilisateur est connecté */}
          {token != '' &&
            <Link to="/mycollection">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faCoins} size="lg" />
                <span className="text hiddenTextMenu"> Ma Collection </span>
              </div>
            </Link>
          }
          {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
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
          {/* ce qui s'affiche quand l'utilisateur est connecté et qu'il y a un nouveau message */}
          {token != '' && newMessage == true &&
            <Link to="/messages">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon className="notificationMessage" icon={faEnvelope} size="lg" />
                <span className="text hiddenTextMenu"> Messages </span>
              </div>
            </Link>
          }
          {/* ce qui s'affiche quand l'utilisateur est connecté et qu'il n'y a pas de nouveau message */}
          {token != '' && newMessage == false &&

            <Link to="/messages">
              <div style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                <span className="text hiddenTextMenu"> Messages </span>
              </div>
            </Link>
          }
          {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
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
        {/* ce qui s'affiche quand l'utilisateur n'est pas connecté */}
        {token == '' &&
          <Link to="/">
            <FontAwesomeIcon icon={faPowerOff} size="lg" color="black" />
            <span className="text hiddenTextMenu" style={{ color: 'black' }}> Connexion </span>
          </Link>
        }
        {/* ce qui s'affiche quand l'utilisateur est connecté */}
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