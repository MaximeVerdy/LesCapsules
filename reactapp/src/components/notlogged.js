// page affichée en cas d'absence de token trouvé

// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useEffect, useState } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { Layout, Row, Col } from 'antd'; // bibliothèque d'interface graphique

// style
import '../css/other.css';

// images
import Logo from '../images/logo-capsules.png';

// composant
export default function NotLogged() {

    // Etat avec sa valeurs initiale à l'inialisation du composant 
    const [timeOff, setTimeOff] = useState(false)

        // à l'initialisation du composant, un compte à rebourd est déclenché, la fin duquel TimeOff prend la valeur true
    useEffect(() => {
        const timer = setTimeout(() => { setTimeOff(true) }, 1000);
    }, [])

    // si l'état TimeOff à la valeur true alors l'utilisateur est redirigé vers la page de connexion
    if (timeOff) {
        return <Redirect to='/' />
    }

    return (

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
                <h3>Vous devez être connecté.e pour accéder à</h3>
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
