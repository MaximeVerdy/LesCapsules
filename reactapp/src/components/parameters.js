// importation à partir de libraries
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Switch, Button, Modal } from 'antd'

//composants
import Topnavbar from './navbar.js'

// style
import '../css/other.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';

function Parameters(props) {

  // Etats
  const [token, setToken] = useState(props.token)     // état du token, récupéré du Redux Store
  const [notifications, setnotifications] = useState(props.notifications)    // état des notifications, récupéré du Redux Store
  const [listErrors, setErrors] = useState([])
  const [erasedConfirmed, seterasedConfirmed] = useState(false)
  
  // Envoi d'un message 
  var changeNotifStatus = async (checked) => {
    const data = await fetch('/notif-status', {
      method: 'PUT', // pour écrire des données en BDD
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${token}&notifications=${checked}`
    })
    
    // réponse du back
    const body = await data.json() // convertion des données reçues en objet JS (parsage)
    setErrors(body.error)
  }

  const { confirm } = Modal

  const redirection = async () => {
    const data = await fetch('/erase-account', {
      method: 'POST', // méthode pour supprimer en BDD
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${token}`
    })
    const body = await data.json()
    seterasedConfirmed(body.result)
  }
  
  if (erasedConfirmed == true) {
    return <Redirect to='/erased-account' />
  }

  const handleErase = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Etes-vous sûr.e de vouloir supprimer ce compte ?',
      okText: 'Je confirme',
      okType: 'danger',
      cancelText: 'J\'ai un doute',
      iconType: 'warning',
      onOk: () => { redirection() } ,
    })
  }

  // condition de rediction en cas d'absence de token 
  if (token == '') {
    return <Redirect to='/notlogged' />
  }

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