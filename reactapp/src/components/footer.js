// import de fonctionnalités à partir de libraries/bibliothèques
import React from 'react'; // bibliothèque de création de composants
import { Link } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 

// style
import '../css/footer.css';

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapStateToProps en bas de fichier)
function Footer(props) {

    return (

        <div >
            {/* à afficher seulement en cas de connexion */}
            {props.token != '' &&
                <div className="footer1">
                    <Link to="/parameters">
                        <p style={{
                            color: 'grey',
                        }}>
                            Paramètres
                      </p>
                    </Link>
                </div>
            }

            <div className="footer2">
                <Link to="/MentionsLegales">
                    <p style={{
                        color: 'grey',
                    }}>
                        Mentions légales
                    </p>
                </Link>
            </div>
        </div>

    )
}

// fonction de récupération de données dans le Redux Store 
function mapStateToProps(state) {
    return {
        token: state.token,
    }
}

export default connect(
    mapStateToProps,
    null
)(Footer)