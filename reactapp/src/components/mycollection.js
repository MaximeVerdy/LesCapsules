// importation à partir de libraries
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Row, Typography, Tag, Modal } from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

function Mycollection(props) {

    // Etats
    const [token, setToken] = useState(props.token) // état du token, récupéré du Redux Store
    const [capsulesList, setCapsulesList] = useState([])
    const [deleted, setDeleted] = useState(0)
    const [positiveResult, setpositiveResult] = useState(false)
    const [timeOff, setTimeOff] = useState(false)
    const [favorites, setfavorites] = useState([])
    const [listErrors, setErrors] = useState([])


    // échange de données avec le back pour la récuration des données à chaque changement de l'état deleted
    useEffect(() => {
        const findcapsules = async () => {
            const data = await fetch(`/my-collection?token=${token}`) // pour récupérer des données 
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setCapsulesList(body.sortedCapsules)
            setErrors(body.error)
            setpositiveResult(body.result)
            setfavorites(body.favorites)
        }
        findcapsules()
        const timer = setTimeout(() => { setTimeOff(true) }, 1000);
    }, [deleted])

    // fonction de suppression d'une capsule en base de données
    var deleteCapsule = async (capsuleRef) => {
        const deleting = await fetch('/my-collection', {
            method: 'DELETE', // méthode pour supprimer en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `capsuleRef=${capsuleRef}&token=${token}`
        })
        setDeleted(deleted + 1)
    }

    // ajout d'une capsule favorite en base de données
    var handleAddFavorite = async (capsuleRef) => {
        const data = await fetch('/add-favorite', {
            method: 'POST', // pour écrire des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}`
        })
        // convertion des données reçues en objet JS (parsage)
        const body = await data.json()
        // réponse positive du back
        if (body.result) {
            setfavorites(body.favorites)
            // si l'échange avec la BDD n'a pas fonctionné, récupérer le tableau d'erreurs venu du back
        } else {
            setErrors(body.error)
        }
    }

    // suppression d'une capsule favorite en base de données
    var handleSuppFavorite = async (capsuleRef) => {
        const data = await fetch('/supp-favorite', {
            method: 'PUT', // pour supprimer des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}`
        })

        // convertion des données reçues en objet JS (parsage)
        const body = await data.json()
        // réponse positive du back
        if (body.result) {
            setfavorites(body.favorites)
            // si l'échange avec la BDD n'a pas fonctionné, récupérer le tableau d'erreurs venu du back
        } else {
            setErrors(body.error)
        }
    }

    const handleModalNoAccess = () => {
        Modal.warning({
            content: 'Vous devez d\'abord vous connecter'
        })
    }

    // mise en forme des titres antd
    const { Title } = Typography;

    if (timeOff) {
        // message en cas d'absence de données enregistrée pour l'instant
        var noCapsule
        if (capsulesList == 0 && listErrors.length == 0) {
            noCapsule = <h4 className="noCapsule">Aucune capsule enregistrée</h4>
        }

        // messages d'erreurs rencontrées en back-end lors de l'enregistrement
        var tabErrorsCaps = listErrors.map((error, i) => {
            return (
                <h4 className="errorMessages">{error} </h4>
            )
        })
    }

    // condition de rediction en cas d'absence de token 
    if (token == '') {
        return <Redirect to='/notlogged' />
    }

    return (
        // le style de la page history est dans css/other.css

        <Layout className="researchLayout">

            <Topnavbar />

            <Row className="capsuleRow">
                <div className="ColForm" >

                    <Title level={6} className="title">
                        Mes précieuses capsules
                    </Title>

                    {/* messages d'erreur */}
                    {tabErrorsCaps}

                    {/* messages d'absenced de données en BDD */}
                    {noCapsule}

                    {positiveResult == true &&
                        <div>
                            {/* map du tableau de données */}
                            {capsulesList.map((capsule, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>


                                    <div className="displayContainer">

                                        <div className="eachCapsule">

                                            <img className="imgCapsule" src={capsule.photo} alt="une capsule" width="80px" />

                                            <div className="presentationData">
                                                <div>
                                                    <Tag color="rgba(51,79,140,0.2)"><span style={{ color: 'black', fontSize: '15px' }}>{capsule.brand}</span></Tag>
                                                </div>
                                                <div className="presentationDataSecond">
                                                    <Tag color="rgba(51,79,140,0.2)"><span style={{ color: '#565656' }}>{capsule.year}</span></Tag>

                                                    <Tag color="rgba(51,79,140,0.2)"> <span style={{ color: '#565656' }}>{capsule.country}</span></Tag>
                                                </div>
                                            </div>



                                        </div>

                                    </div>

                                    <div className="trashBt">
                                        {token != '' && favorites.includes(capsule.capsuleRef) &&
                                            <FontAwesomeIcon icon={faHeart} size="lg" color='red'
                                                // au clic, ajout aux favoris 
                                                onClick={() => handleSuppFavorite(capsule.capsuleRef)}
                                            />
                                        }
                                        {token != '' && !favorites.includes(capsule.capsuleRef) &&
                                            <FontAwesomeIcon icon={faHeart} size="lg" color='grey'
                                                // au clic, suppression des favoris 
                                                onClick={() => handleAddFavorite(capsule.capsuleRef)}
                                            />
                                        }
                                        {token == '' &&
                                            <FontAwesomeIcon icon={faHeart} size="lg" color='grey'
                                                // au clic, ouverture du pop up d'avertissement
                                                onClick={() => handleModalNoAccess()}
                                            />
                                        }

                                        <div className="spaceFavMsg">
                                        </div>



                                        <FontAwesomeIcon icon={faTrash} size="lg" color="grey"
                                            // au clic, suppression de la capsule en BDD
                                            onClick={() => deleteCapsule(capsule.capsuleRef)}
                                        />
                                    </div>

                                </div>

                            ))}
                        </div>
                    }

                </div>

            </Row>

            <div className="endDiv"></div>


            <Footer />

        </Layout>

    );
}

// fonction de récupération de données dans le Redux Store 
function mapStateToProps(state) {
    return { token: state.token }
}

export default connect(
    mapStateToProps,
    null
)(Mycollection)