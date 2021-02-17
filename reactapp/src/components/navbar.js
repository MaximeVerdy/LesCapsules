import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { Menu, } from 'antd'

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

  const [newMessage, setnewMessage] = useState(props.newMessage)
  const [token, settoken] = useState(props.token)

  
  useEffect(() => {
  setnewMessage(props.newMessage)
  console.log("props-----------------", props);
}, [props])

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

        {/* <span className="hiddenTextMenu" style={{color:'black' }}> Les capsules </span> */}
      </div>

      <Menu className="menu" style={{ textAlign: 'center' }} mode="horizontal" >


        <Menu.Item key="research">
          <Link to="/">
            <div style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faSearch} size="lg" />
              {/* search, accueil, home, toutes les capsules */}
              <span className="text hiddenTextMenu"> Recherche</span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="favorites">
          <Link to="/favorites">
            <div style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faHeart} size="lg" />
              <span className="text hiddenTextMenu"> Favoris</span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="ajout">
          <Link to="/addcapsule">
            <div style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faPlusCircle} size="lg" />
              <span className="text hiddenTextMenu"> Ajout</span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="collection">
          <Link to="/mycollection">
            <div style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faCoins} size="lg" />
              <span className="text hiddenTextMenu"> Ma collection </span>
            </div>
          </Link>
        </Menu.Item>

        <Menu.Item key="messages">
              {newMessage == true &&
                         <Link to="/messages">
                         <div style={{ color: 'black' }}>
                           <FontAwesomeIcon className="notificationMessage" icon={faEnvelope} size="lg" />
                           <span className="text hiddenTextMenu"> Messages </span>
                         </div>
                       </Link>
                }
              {newMessage == false &&

          <Link to="/messages">
            <div style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
              <span className="text hiddenTextMenu"> Messages </span>
            </div>
          </Link>
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
        <Link to="/login">
          <FontAwesomeIcon icon={faPowerOff} size="lg" color="black" />
          <span className="text hiddenTextMenu" style={{ color: 'black' }}> Conec / Déconec </span>
        </Link>
      </div>


    </div>


  );

}

function mapStateToProps(state) {
  return { token: state.token,
    newMessage: state.newMessage
   }
}

export default connect(
  mapStateToProps,
  null
)(Topnavbar)