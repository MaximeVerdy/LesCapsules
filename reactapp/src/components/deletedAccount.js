// page affichée en cas de suppression de compte dans parameters

// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useEffect, useState } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de gestion d'état 
import { connect } from 'react-redux' // bibliothèque de liaison entre les composants
import { Layout, Row, Col } from 'antd'; // bibliothèque d'interface graphique

// style
import '../css/other.css';

// images
import Logo from '../images/logo-capsules.png';

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapDispatchToProps en bas de fichier)
function Deleted(props) {

    // Etat avec sa valeurs initiale à l'inialisation du composant 
    const [timeOff, setTimeOff] = useState(false)

    // à l'initialisation du composant le token prend la valeur '' et un compte à rebourd est déclenché, la fin duquel TimeOff prend la valeur true
    useEffect(() => {
        props.addToken('')
        const timer = setTimeout(() => { setTimeOff(true) }, 2500);
    }, [])

    // si l'état TimeOff à la valeur true alors l'utilisateur est redirigé vers la page de connexion
    if (timeOff) {
        return <Redirect to='/' />
    }

    return (
        // le style de la page est dans ../css/other.css
        
        <Layout className="researchLayout"
            style={{
                placeContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >

            <Row
                style={{
                    marginTop: '-120px'
                }}
            >
                <h3>Votre compte a bien été supprimé. Nous espérons vous revoir sur</h3>
            </Row>

            <Row>
                <Col
                    style={{
                        marginTop: '30px'
                    }}
                >
                    <img
                        src={Logo}
                        alt="Logo Les Capsules"
                        width="600px"
                    />
                </Col>
            </Row>
        </Layout>
    );
}

// fonction de transmission de données au Redux Store
function mapDispatchToProps(dispatch) {
    return {
        addToken: function (token) {
            dispatch({ type: 'addToken', token: token })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Deleted)