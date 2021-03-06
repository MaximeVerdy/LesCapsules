// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useState, useEffect } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 
import {
    Layout,
    Row,
    Typography,
    Tag,
    Modal,
} from 'antd'; // bibliothèque d'interface graphique

//composants créés ailleurs et importés
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';

// icônes utilisées dans le composant
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapStateToProps en bas de fichier)
function Favorites(props) {

    // Etats avec leurs valeurs initiales à l'inialisation du composant 
    const [token, setToken] = useState(props.token)     // état du token, récupéré du Redux Store
    const [capsulesList, setCapsulesList] = useState([])
    const [listErrors, setErrors] = useState([])
    const [favorites, setfavorites] = useState([])
    const [positiveResult, setpositiveResult] = useState(false)
    const [redirection, setredirection] = useState(false)
    const [pageActual, setpageActual] = useState(0)
    const [pagesTotal, setPagesTotal] = useState(0)
    const [stepOfCapsule, setstepOfCapsule] = useState(0)
    const [resultFromBack, setresultFromBack] = useState(false)

    useEffect(() => { // le hook d'effet se déclenchera à chaque mise à jour d'un de ces états : favorites et pageActual
        // échange de données avec le back pour la récuration des données
        const findcapsules = async () => {
            const data = await fetch(`/all-my-favorites?token=${token}&stepOfCapsule=${stepOfCapsule}`) // pour lire des données en base de données avec méthode GET. la route utilisée et les données envoyées en back après le ?
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setCapsulesList(body.capsulesSorted) // récupération des données des capsules
            setErrors(body.error) // erreurs éventuellement rencontrées en Back
            setfavorites(body.favorites) // le tableau des favoris est récupéré du back
            setpositiveResult(body.result)
            setPagesTotal(Math.ceil(body.numberOfDocuments / 10)) // nombre total de résultats de recherche
            if (body.capsulesSorted) { setresultFromBack(true) }
            if (body.capsulesSorted.length == 0) { setPagesTotal(1) } // afin que la page 1 des résultats de recherche ne soit jamais zéro
        }
        findcapsules()  // appel de la fonction
    }, [favorites, pageActual]) // le hook d'effet se déclenchera à chaque mise à jour d'un de ces états


    // configuration du passage aux pages suivantes de résultats au clic par groupe de 10 résultats
    const pageNext = () => {
        if (pageActual < pagesTotal - 1) {
            setpageActual(pageActual + 1)
            setstepOfCapsule(stepOfCapsule + 10)
            window.scrollTo(0, 0)
        }
    }

     // configuration du passage aux pages précédentes de résultats  au clic par groupe de 10 résultats
    const pageBefore = () => {
        if (pageActual > 0) {
            setpageActual(pageActual - 1)
            window.scrollTo(0, 0)
        } else {
            setpageActual(0)
        }
        if (stepOfCapsule > 0) {
            setstepOfCapsule(stepOfCapsule - 10)
        } else {
            setstepOfCapsule(0)
        }
    }

    // suppression d'une capsule favorite en base de données au clic sur l'icône "heart"
    var handleSuppFavorite = async (capsuleRef) => {
        // réinitialisation des pages
        setpageActual(0)
        setstepOfCapsule(0)

        const data = await fetch('/supp-favorite', { // communication avec le back sur cette route 
            method: 'PUT', // pour mettre à jour des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}` // données envoyées au Back
        })

        const body = await data.json() // convertion des données reçues en objet JS (parsage)
        if (body.result) {  // si réponse positive du back
            setfavorites(body.favorites) // récupération du tableau de favoris du back
        } else { // sinon récupérer le tableau d'erreurs venu du back dans un état
            setErrors(body.error)
        }
    }

    // Envoi d'un message au clic sur l'icône "enveloppe"
    var handleSendMessage = async (capsuleRef) => { // en argument de la fonction, l'identifiant de la capsule concernée
        const data = await fetch('/first-message', { // communication avec le back sur cette route 
            method: 'POST', // pour écrire des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}` // données envoyées au Back
        })

        const body = await data.json() // convertion des données reçues en objet JS (parsage)
        if (body.updated) {  // réponse positive du back
            setredirection(true) // changement de l'état redirection qui déclanchement la redirection
        } else { // sinon afficher un popup d'erreur
            Modal.warning({
                content: 'Vous ne pouvez pas écrire à vous même'
            });
        }
    }

    // en cas de clic sur un bouton non autorisé quand l'utilisateur n'est pas connecté un popup d'avertissement s'ouvre
    const handleModalNoAccess = () => {
        Modal.warning({
            content: 'Vous devez d\'abord vous connecter'
        })
    }

    // quand un nouveau message peut être envoyé par l'utilisateur alors il est redirigé vers le composant Messages
    if (redirection === true) {
        return <Redirect to='/messages' />
    }

    // mise en forme des titres via antd
    const { Title } = Typography;

    // message d'attente tant que les données en BDD ne sont pas chargées
    var noCapsule
    if (!resultFromBack) {
        noCapsule = <h4 className="errorMessages">On rassemble les données pour vous...</h4>
    }

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var Errors = listErrors.map((error, i) => {
        return (
            <h4 className="errorMessages">{error} </h4>
        )
    })

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
                        Mes capsules favorites
                    </Title>

                    {/* messages d'erreur */}
                    {Errors}

                    {/* messages d'absence de données en BDD */}
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
                                        <FontAwesomeIcon icon={faHeart} size="lg" color='red' id="button"
                                            // au clic, ajout aux favoris 
                                            onClick={() => handleSuppFavorite(capsule.capsuleRef)}
                                        />



                                        <div className="spaceFavMsg">
                                        </div>

                                        {token != '' &&
                                            <FontAwesomeIcon icon={faEnvelope} size="lg" color='grey' id="button"
                                                // au clic, envoi d'un message
                                                onClick={() => handleSendMessage(capsule.capsuleRef)}
                                            />
                                        }
                                        {token == '' &&
                                            <FontAwesomeIcon icon={faEnvelope} size="lg" color='grey' id="button"
                                                // au clic, ouverture du pop up d'avertissement
                                                onClick={() => handleModalNoAccess()}
                                            />
                                        }
                                    </div>

                                </div>

                            ))}
                        </div>
                    }


                </div>
            </Row>

            <Row className="backFoward">
                <FontAwesomeIcon icon={faLongArrowAltLeft} size="4x" color='grey' id="button"
                    onClick={() => pageBefore()}
                />

                <div className="numberOfPages">
                    (  {pageActual + 1} / {pagesTotal} )
                </div>

                <FontAwesomeIcon icon={faLongArrowAltRight} size="4x" color='grey' id="button"
                    onClick={() => pageNext()}
                />
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