import React, { useState, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Row, Typography, Tag } from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function Mycollection(props) {
    

    // Etats

    // état du token, récupéré du Redux Store
    const [token, setToken] = useState(props.token)
    const [capsulesList, setCapsulesList] = useState([])
    const [deleted, setDeleted] = useState(0)
    const [listCaps, setCaps] = useState([])


    // échange de données avec le back pour la récuration des données à chaque changement de l'état deleted
    useEffect(() => {
        const findcapsules = async () => {
            const data = await fetch(`/my-collection?token=${token}`) // pour récupérer des données 
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setCapsulesList(body.capsules)
            setCaps(body.error)
        }

        
        findcapsules()
        },[deleted])

    // fonction de suppression d'une capsule en base de données
    var deleteCapsule = async (capsuleRef) => {
        const deleting = await fetch('/my-collection', {
        method: 'DELETE', // méthode pour supprimer en BDD
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `capsuleRef=${capsuleRef}&token=${token}`
        })

        setDeleted(deleted + 1)
    }

    // message en cas d'absence de données enregistrée pour l'instant
    var noCapsule
    if (capsulesList == 0 && listCaps.length == 0) {
        noCapsule = <h4 style={{ display: 'flex', margin: "30px", marginBottom: "50px", justifyContent: 'center', color: 'red' }}>Aucune capsule enregistrée</h4>
    }


    // mise en forme des titres antd
    const { Title } = Typography;

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsCaps = listCaps.map((error, i) => {
        return (<h4 style={{ display: 'flex', margin: "30px", marginBottom: "50px", justifyContent: 'center', color: 'red' }}
        >
            {error}
        </h4>
        )
    })

    // condition de rediction en cas d'absence de token 
    // if(token == ''){
    //     return <Redirect to='/notlogged' />
    //     }   

    return (
        // le style de la page history est dans css/other.css

        <Layout className="researchLayout">

            <Topnavbar />

            <Row className="capsuleRow">
                <div className="ColForm" >

                    <Title level={3} className="title">
                        Mes capsules
                    </Title>

                    {/* messages d'erreur */}
                    {tabErrorsCaps}

                    {/* messages d'absenced de données en BDD */}
                    {noCapsule}

                    {/* map du tableau de données */}
                    {capsulesList.map((capsule, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>


                            <div className="displayContainer">

                                <div className="eachCapsule">

                                    <img className="imgCapsule" src={capsule.photo} alt="une capsule" width="80px" />

                                    <Tag color="#E09500">{capsule.brand}</Tag>

                                    <Tag color="#E09500"> {capsule.year}</Tag>

                                    <Tag color="#E09500"> {capsule.country}</Tag>



                                </div>

                            </div>

                            <div className="trashBt">
                                <FontAwesomeIcon icon={faTrash} size="lg" color="grey"
                                // au clic, suppression de la capsule en BDD
                                onClick={() => deleteCapsule(capsule.capsuleRef)}
                                />
                            </div>

                        </div>

                    ))}


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