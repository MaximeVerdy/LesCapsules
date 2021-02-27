// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useState, useEffect } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 
import { Switch, Button, Modal } from 'antd' // bibliothèque d'interface graphique

//composants créés ailleurs et importés
import Topnavbar from './navbar.js'

// style
import '../css/other.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapStateToProps en bas de fichier)
function Parameters(props) {

  // Etats avec leurs valeurs initiales à l'inialisation du composant 
  const [token, setToken] = useState(props.token)     // état du token, récupéré du Redux Store
  const [notifications, setnotifications] = useState(props.notifications)    // état des notifications, récupéré du Redux Store
  const [listErrors, setErrors] = useState([])
  const [erasedConfirmed, seterasedConfirmed] = useState(false)
  
  // au clic, changement du statut de notification par email
  var changeNotifStatus = async (checked) => { // communication avec le back sur cette route 
    const data = await fetch('/notif-status', {
      method: 'PUT', // pour mettre à jour des données en BDD
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${token}&notifications=${checked}` // données envoyées au Back
    })
    
    const body = await data.json() // convertion des données reçues en objet JS (parsage)
    setErrors(body.error)
  }

  // configuration du popup ouvert au clic sur "Suppression" pour demander si l'utilisateur est sûr de vouloir supprimer son compte
  const { confirm } = Modal


  // au clic sur la confirmation de suppression de compte, suppression du compte en BDD
  const suppressionCompte = async () => {
    const data = await fetch('/erase-account', { // communication avec le back sur cette route 
      method: 'DELETE', // méthode pour supprimer en BDD
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${token}` // données envoyées au Back
    })
    const body = await data.json() // convertion des données reçues en objet JS (parsage)
    seterasedConfirmed(body.result) // récupération de la confirmation de suppression
  }
  // si supprimé alors redirection de l'utilisateur vers la page deleted account
  if (erasedConfirmed == true) { 
    return <Redirect to='/erased-account' />
  }

    // au clic sur le bouton "Suppression", ouverture du popup de confirmation
  const handleErase = () => {
    // option du popup
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Etes-vous sûr.e de vouloir supprimer ce compte ?',
      okText: 'Je confirme',
      okType: 'danger',
      cancelText: 'J\'ai un doute',
      iconType: 'warning',
      onOk: () => { suppressionCompte() } ,
    })
  }

  // condition de rediction en cas d'absence de token 
  if (token == '') {
    return <Redirect to='/notlogged' />
  }

  // mise en page des erreurs venues du back
  var Errors = listErrors.map((error, i) => {
    return (
      <h4 className="errorMessages"> {error} </h4>
    )
  })

  return (

    <div>

      <Topnavbar />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '90vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <div className="parameters" >
          <span style={{ paddingRight: '12px', fontSize: '17px' }}>
            Notifications de nouveaux messages par email
          </span>
          <Switch style={{ top: '2px' }}
            defaultChecked={notifications}
            onChange={changeNotifStatus} />
        </div>

        <div className="parameters">
          <span style={{ paddingRight: '12px', fontSize: '17px' }}>
            Suppression définive de votre compte
          </span>
          <Button type="primary" danger
          style={{ top: '-2px' }}
            onClick={() => handleErase()}>
            Suppression
          </Button>
        </div>

        <div className="parameters">
          {/* messages d'erreur */}
          {Errors}
        </div>

      </div>

    </div>
  )
}

// fonction de récupération de données dans le Redux Store 
function mapStateToProps(state) {
  return {
    token: state.token,
    notifications: state.notif
  }
}

export default connect(
  mapStateToProps,
  null
)(Parameters)