import React, { useState, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Layout,
    Row,
    Col,
    Typography,
    Tag,
    Form,
    Select,
    InputNumber,
    Input,
    Button,
} from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function Favorites(props) {

    // année actuelle
    var today = new Date();
    var yyyy = today.getFullYear();

    // Etats
    const [year, setYear] = useState('')
    function onChangeYear(value) {
        setYear(value);
    }

    const [brand, setBrand] = useState('')
    // function onChangeBrand(value) {
    //   setBrand(value);
    // }

    const [country, setCountry] = useState('aucun')
    function onChangeCountry(value) {
        setCountry(value);
    }

    // état du token, récupéré du Redux Store
    const [token, setToken] = useState(props.token)
    const [capsulesList, setCapsulesList] = useState([])
    const [listErrors, setErrors] = useState([])

    const [saved, setSaved] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const [favorites, setfavorites] = useState([])

    // échange de données avec le back pour la récuration des données au chargement du composant
    useEffect(() => {
        const findcapsules = async () => {
            const data = await fetch(`/all-my-favorites?token=${token}`) // pour récupérer des données 
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setCapsulesList(body.capsules)
            setErrors(body.error)
            setfavorites(body.favorites)
            
        }
        findcapsules()

    }, [favorites])

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
                setDeleted(true)
                setfavorites(body.favorites)
                // si l'échange avec la BDD n'a pas fonctionné, récupérer le tableau d'erreurs venu du back
            } else {
                setErrors(body.error)
            }
        }

    // message en cas d'absence de données enregistrée pour l'instant
    var noCapsule
    if (capsulesList == 0 && listErrors.length == 0) {
        noCapsule = <h4 style={{ display: 'flex', margin: "30px", marginBottom: "50px", justifyContent: 'center', color: 'red' }}>Aucune capsule favorite</h4>
    }


    // mise en forme des titres antd
    const { Title } = Typography;

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var Errors = listErrors.map((error, i) => {
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
                        Mes capsules favorites
                    </Title>

                    {/* messages d'erreur */}
                    {Errors}

                    {/* messages d'absenced de données en BDD */}
                    {noCapsule}

                    {/* map du tableau de données */}
                    {capsulesList.map((capsule, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>


                            <div className="mapContainer">

                                <div className="eachCapsule">

                                    <img className="imgCapsule" src={capsule.photo} alt="une capsule" width="80px" />

                                    <Tag color="#E09500">{capsule.brand}</Tag>

                                    <Tag color="#E09500"> {capsule.year}</Tag>

                                    <Tag color="#E09500"> {capsule.country}</Tag>



                                </div>

                            </div>

                            <div className="trashBt">
                                    <FontAwesomeIcon icon={faHeart} size="lg" color='red'
                                        // au clic, ajout aux favoris 
                                        onClick={() => handleSuppFavorite(capsule.capsuleRef)}
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
)(Favorites)