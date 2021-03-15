// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useState, useEffect } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 
import {
    Layout,
    Row,
    Typography,
    Tag,
    Form,
    Select,
    InputNumber,
    Input,
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
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir function mapStateToProps en bas de fichier)
function Research(props) {

    // caractérisation de l'année actuelle
    var today = new Date();
    var yyyy = today.getFullYear();

    // Etats avec leurs valeurs initiales à l'inialisation du composant 
    const [brand, setBrand] = useState('')
    const [token, setToken] = useState(props.token)     // état du token, récupéré du Redux Store
    const [capsulesList, setCapsulesList] = useState([])
    const [listErrors, setErrors] = useState([])
    const [favorites, setfavorites] = useState([])
    const [redirection, setredirection] = useState(false)
    const [year, setYear] = useState('')
    const [country, setCountry] = useState('tous')
    const [pageActual, setpageActual] = useState(0)
    const [searchAction, setsearchAction] = useState(0)
    const [pagesTotal, setPagesTotal] = useState(0)
    const [stepOfCapsule, setstepOfCapsule] = useState(0)
    const [resultFromBack, setresultFromBack] = useState(false)

    // changement des valeurs des état par les champs de saisie
    function onChangeYear(value) {
        setYear(value);
    }
    function onChangeCountry(value) {
        setCountry(value);
    }

    useEffect(() => { // le hook d'effet se déclenchera à chaque mise à jour d'un de ces états : pageActual, searchAction
        const findcapsules = async () => {
            if (year === null) { // si l'année n'a pas de valeur numéraire
                const data = await fetch(`/research?token=${token}&brand=${brand}&year=${''}&country=${country}&stepOfCapsule=${stepOfCapsule}`) // pour lire des données en base de données avec méthode GET. la route utilisée et les données envoyées en back après le ?
                const body = await data.json() // convertion des données reçues en objet JS (parsage)
                setCapsulesList(body.capsules) // récupération des données des capsules
                setfavorites(body.favorites) // récupération des données des favoris
                setPagesTotal(Math.ceil(body.numberOfDocuments / 10)) // nombre total de résultats de recherche
                setErrors(body.error) // erreurs éventuellement rencontrées en Back
                if (body.capsules) { setresultFromBack(true) }
                if (body.capsules.length == 0) { setPagesTotal(1) } // afin que la page 1 des résultats de recherche ne soit jamais zéro
            } else { // sinon... 
                const data = await fetch(`/research?token=${token}&brand=${brand}&year=${year}&country=${country}&stepOfCapsule=${stepOfCapsule}`) // pour lire des données en base de données avec méthode GET. la route utilisée et les données envoyées en back après le ?
                const body = await data.json() // convertion des données reçues en objet JS (parsage)
                setCapsulesList(body.capsules) // récupération des données des capsules
                setfavorites(body.favorites) // récupération des données des favoris
                setPagesTotal(Math.ceil(body.numberOfDocuments / 10)) // nombre total de résultats de recherche
                setErrors(body.error) // erreurs éventuellement rencontrées en Back
                if (body.capsules) { setresultFromBack(true) }
                if (body.capsules.length == 0) { setPagesTotal(1) } // afin que la page 1 des résultats de recherche ne soit jamais zéro
            }
        }
        findcapsules() // appel de la fonction
    }, [pageActual, searchAction]) // le hook d'effet se déclenchera à chaque mise à jour d'un de ces états

    // au clic sur l'icône loupe, déclenchement du hook d'effet et réinitialisation de la page actuelle
    var handleSubmitSearch = () => {
        setsearchAction(searchAction + 1)
        setpageActual(0)
        setstepOfCapsule(0)
    }

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

    // ajout d'une capsule favorite en base de données  au clic sur l'icône "heart"
    var handleAddFavorite = async (capsuleRef) => {
        const data = await fetch('/add-favorite', { // communication avec le back sur cette route
            method: 'POST', // pour écrire des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}` // données envoyées au Back
        })

        const body = await data.json() // convertion des données reçues en objet JS (parsage)
        // si le résultat existe, le transmettre dans un état correspondant 
        if (body.result) {
            setfavorites(body.favorites) // récuppération du tableau de favoris
            // sinon récupérer le tableau d'erreurs venu du back dans un état
        } else {
            setErrors(body.error)
        }
    }

    // suppression d'une capsule favorite en base de données  au clic sur l'icône "heart"
    var handleSuppFavorite = async (capsuleRef) => {
        const data = await fetch('/supp-favorite', { // communication avec le back sur cette route
            method: 'PUT', // pour la mise en jour des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}` // données envoyées au Back
        })

        const body = await data.json() // convertion des données reçues en objet JS (parsage)
        // si le résultat existe, le transmettre dans un état correspondant 
        if (body.result) {
            setfavorites(body.favorites) // récuppération du tableau de favoris
            // sinon récupérer le tableau d'erreurs venu du back dans un état
        } else {
            setErrors(body.error)
        }
    }

    // Envoi d'un message au clic sur l'icône enveloppe
    var handleSendMessage = async (capsuleRef) => {
        const data = await fetch('/first-message', { // communication avec le back sur cette route
            method: 'POST', // pour écrire des données en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&capsuleRef=${capsuleRef}` // données envoyées au Back
        })

        const body = await data.json() // convertion des données reçues en objet JS (parsage)
        setredirection(body.updated)  // récuppération du statut d'update faite. la valeur déterminera si la redirection vers les messages se fera
        // si le tableau d'erreur est rempli, récupérer le tableau dans un état
        if (body.error.length > 0) { // s'il y a des erreurs les mettre dans l'état relatifs aux erreurs
            setErrors(body.error)
        }
        if (body.userIsOwner == true) { // si l'utilisateur est aussi le propriétaire de la capsule alors un popup d'avertissement apparait
            Modal.warning({
                content: 'Vous ne pouvez pas écrire à vous même'
            });
        }
    }

    // condition de redirection vers le composant Messages 
    if (redirection == true) {
        return <Redirect to='/messages' />
    }

    // au clic, quand l'utilisateur n'est pas connecté, ouverture du pop up d'avertissement 
    const handleModalNoAccess = () => {
        Modal.warning({
            content: 'Vous devez d\'abord vous connecter'
        })
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
            <h4 className="errorMessages"> {error} </h4>
        )
    })


    return (
        // le style de la page Research est dans css/other.css

        <Layout className="researchLayout">

            <Topnavbar />

            <Row className="capsuleRow capsuleRowParam">
                <div className="ColForm" >

                    <Title level={6} className="title">
                        Toutes les capsules publiées
                    </Title>


                    <div className="ColWrapperParam" >

                        <div className="ColParam"
                        >
                            {/* formulaire ant design */}
                            <Form
                                style={{
                                    position: 'relative',
                                    top: '11px',
                                }}
                            >
                                <Form.Item >

                                    <Input id="brandInput"
                                        placeholder={"Gallia ou autre"}
                                        onChange={(e) => setBrand(e.target.value)}
                                    />
                                </Form.Item>
                            </Form>
                        </div>


                        <div className="ColParam"
                        >
                            {/* formulaire ant design */}
                            <Form
                                style={{
                                    position: 'relative',
                                    top: '11px',
                                }}
                            >
                                <Form.Item>
                                    <InputNumber
                                        style={{
                                            width: 70,
                                            textAlign: "center"
                                        }}
                                        max={yyyy}
                                        pattern={"^[0-9]+$"}
                                        placeholder={"annnée"}
                                        defaultValue={''}
                                        onChange={onChangeYear}
                                    />
                                </Form.Item>
                            </Form>
                        </div>

                        <div className="ColParam"
                        >
                            {/* formulaire ant design */}
                            <Form
                                style={{
                                    position: 'relative',
                                    top: '11px',
                                }}
                            >
                                <Form.Item >
                                    <Select
                                        style={{
                                            width: 120,
                                            textAlign: "left"
                                        }}
                                        placeholder="pays"
                                        onChange={onChangeCountry}
                                    >
                                        <Select.Option value="tous">TOUS</Select.Option >
                                        <Select.Option value="Albania">Albania</Select.Option >
                                        <Select.Option value="Algeria">Algeria</Select.Option >
                                        <Select.Option value="American Samoa">American Samoa</Select.Option >
                                        <Select.Option value="Andorra">Andorra</Select.Option >
                                        <Select.Option value="Angola">Angola</Select.Option >
                                        <Select.Option value="Anguilla">Anguilla</Select.Option >
                                        <Select.Option value="Antartica">Antarctica</Select.Option >
                                        <Select.Option value="Antigua and Barbuda">Antigua and Barbuda</Select.Option >
                                        <Select.Option value="Argentina">Argentina</Select.Option >
                                        <Select.Option value="Armenia">Armenia</Select.Option >
                                        <Select.Option value="Aruba">Aruba</Select.Option >
                                        <Select.Option value="Australia">Australia</Select.Option >
                                        <Select.Option value="Austria">Austria</Select.Option >
                                        <Select.Option value="Azerbaijan">Azerbaijan</Select.Option >
                                        <Select.Option value="Bahamas">Bahamas</Select.Option >
                                        <Select.Option value="Bahrain">Bahrain</Select.Option >
                                        <Select.Option value="Bangladesh">Bangladesh</Select.Option >
                                        <Select.Option value="Barbados">Barbados</Select.Option >
                                        <Select.Option value="Belarus">Belarus</Select.Option >
                                        <Select.Option value="Belgium">Belgium</Select.Option >
                                        <Select.Option value="Belize">Belize</Select.Option >
                                        <Select.Option value="Benin">Benin</Select.Option >
                                        <Select.Option value="Bermuda">Bermuda</Select.Option >
                                        <Select.Option value="Bhutan">Bhutan</Select.Option >
                                        <Select.Option value="Bolivia">Bolivia</Select.Option >
                                        <Select.Option value="Bosnia and Herzegowina">Bosnia and Herzegowina</Select.Option >
                                        <Select.Option value="Botswana">Botswana</Select.Option >
                                        <Select.Option value="Bouvet Island">Bouvet Island</Select.Option >
                                        <Select.Option value="Brazil">Brazil</Select.Option >
                                        <Select.Option value="British Indian Ocean Territory">British Indian Ocean Territory</Select.Option >
                                        <Select.Option value="Brunei Darussalam">Brunei Darussalam</Select.Option >
                                        <Select.Option value="Bulgaria">Bulgaria</Select.Option >
                                        <Select.Option value="Burkina Faso">Burkina Faso</Select.Option >
                                        <Select.Option value="Burundi">Burundi</Select.Option >
                                        <Select.Option value="Cambodia">Cambodia</Select.Option >
                                        <Select.Option value="Cameroon">Cameroon</Select.Option >
                                        <Select.Option value="Canada">Canada</Select.Option >
                                        <Select.Option value="Cape Verde">Cape Verde</Select.Option >
                                        <Select.Option value="Cayman Islands">Cayman Islands</Select.Option >
                                        <Select.Option value="Central African Republic">Central African Republic</Select.Option >
                                        <Select.Option value="Chad">Chad</Select.Option >
                                        <Select.Option value="Chile">Chile</Select.Option >
                                        <Select.Option value="China">China</Select.Option >
                                        <Select.Option value="Christmas Island">Christmas Island</Select.Option >
                                        <Select.Option value="Cocos Islands">Cocos (Keeling) Islands</Select.Option >
                                        <Select.Option value="Colombia">Colombia</Select.Option >
                                        <Select.Option value="Comoros">Comoros</Select.Option >
                                        <Select.Option value="Congo">Congo</Select.Option >
                                        <Select.Option value="RDC">Democratic Republic of the Congo</Select.Option >
                                        <Select.Option value="Cook Islands">Cook Islands</Select.Option >
                                        <Select.Option value="Costa Rica">Costa Rica</Select.Option >
                                        <Select.Option value="Cota D'Ivoire">Cote d'Ivoire</Select.Option >
                                        <Select.Option value="Croatia">Croatia (Hrvatska)</Select.Option >
                                        <Select.Option value="Cuba">Cuba</Select.Option >
                                        <Select.Option value="Cyprus">Cyprus</Select.Option >
                                        <Select.Option value="Czech Republic">Czech Republic</Select.Option >
                                        <Select.Option value="Denmark">Denmark</Select.Option >
                                        <Select.Option value="Djibouti">Djibouti</Select.Option >
                                        <Select.Option value="Dominica">Dominica</Select.Option >
                                        <Select.Option value="Dominican Republic">Dominican Republic</Select.Option >
                                        <Select.Option value="East Timor">East Timor</Select.Option >
                                        <Select.Option value="Ecuador">Ecuador</Select.Option >
                                        <Select.Option value="Egypt">Egypt</Select.Option >
                                        <Select.Option value="El Salvador">El Salvador</Select.Option >
                                        <Select.Option value="Equatorial Guinea">Equatorial Guinea</Select.Option >
                                        <Select.Option value="Eritrea">Eritrea</Select.Option >
                                        <Select.Option value="Estonia">Estonia</Select.Option >
                                        <Select.Option value="Ethiopia">Ethiopia</Select.Option >
                                        <Select.Option value="Falkland Islands">Falkland Islands (Malvinas)</Select.Option >
                                        <Select.Option value="Faroe Islands">Faroe Islands</Select.Option >
                                        <Select.Option value="Fiji">Fiji</Select.Option >
                                        <Select.Option value="Finland">Finland</Select.Option >
                                        <Select.Option value="France">France</Select.Option >
                                        <Select.Option value="France Metropolitan">France, Metropolitan</Select.Option >
                                        <Select.Option value="French Guiana">French Guiana</Select.Option >
                                        <Select.Option value="French Polynesia">French Polynesia</Select.Option >
                                        <Select.Option value="French Southern Territories">French Southern Territories</Select.Option >
                                        <Select.Option value="Gabon">Gabon</Select.Option >
                                        <Select.Option value="Gambia">Gambia</Select.Option >
                                        <Select.Option value="Georgia">Georgia</Select.Option >
                                        <Select.Option value="Germany">Germany</Select.Option >
                                        <Select.Option value="Ghana">Ghana</Select.Option >
                                        <Select.Option value="Gibraltar">Gibraltar</Select.Option >
                                        <Select.Option value="Greece">Greece</Select.Option >
                                        <Select.Option value="Greenland">Greenland</Select.Option >
                                        <Select.Option value="Grenada">Grenada</Select.Option >
                                        <Select.Option value="Guadeloupe">Guadeloupe</Select.Option >
                                        <Select.Option value="Guam">Guam</Select.Option >
                                        <Select.Option value="Guatemala">Guatemala</Select.Option >
                                        <Select.Option value="Guinea">Guinea</Select.Option >
                                        <Select.Option value="Guinea-Bissau">Guinea-Bissau</Select.Option >
                                        <Select.Option value="Guyana">Guyana</Select.Option >
                                        <Select.Option value="Haiti">Haiti</Select.Option >
                                        <Select.Option value="Heard and McDonald Islands">Heard and Mc Donald Islands</Select.Option >
                                        <Select.Option value="Holy See">Holy See (Vatican City State)</Select.Option >
                                        <Select.Option value="Honduras">Honduras</Select.Option >
                                        <Select.Option value="Hong Kong">Hong Kong</Select.Option >
                                        <Select.Option value="Hungary">Hungary</Select.Option >
                                        <Select.Option value="Iceland">Iceland</Select.Option >
                                        <Select.Option value="India">India</Select.Option >
                                        <Select.Option value="Indonesia">Indonesia</Select.Option >
                                        <Select.Option value="Iran">Iran (Islamic Republic of)</Select.Option >
                                        <Select.Option value="Iraq">Iraq</Select.Option >
                                        <Select.Option value="Ireland">Ireland</Select.Option >
                                        <Select.Option value="Israel">Israel</Select.Option >
                                        <Select.Option value="Italy">Italy</Select.Option >
                                        <Select.Option value="Jamaica">Jamaica</Select.Option >
                                        <Select.Option value="Japan">Japan</Select.Option >
                                        <Select.Option value="Jordan">Jordan</Select.Option >
                                        <Select.Option value="Kazakhstan">Kazakhstan</Select.Option >
                                        <Select.Option value="Kenya">Kenya</Select.Option >
                                        <Select.Option value="Kiribati">Kiribati</Select.Option >
                                        <Select.Option value="Democratic People's Republic of Korea">Korea, Democratic People's Republic of</Select.Option >
                                        <Select.Option value="Korea">Korea, Republic of</Select.Option >
                                        <Select.Option value="Kuwait">Kuwait</Select.Option >
                                        <Select.Option value="Kyrgyzstan">Kyrgyzstan</Select.Option >
                                        <Select.Option value="Lao">Lao People's Democratic Republic</Select.Option >
                                        <Select.Option value="Latvia">Latvia</Select.Option >
                                        <Select.Option value="Lebanon" selected>Lebanon</Select.Option >
                                        <Select.Option value="Lesotho">Lesotho</Select.Option >
                                        <Select.Option value="Liberia">Liberia</Select.Option >
                                        <Select.Option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</Select.Option >
                                        <Select.Option value="Liechtenstein">Liechtenstein</Select.Option >
                                        <Select.Option value="Lithuania">Lithuania</Select.Option >
                                        <Select.Option value="Luxembourg">Luxembourg</Select.Option >
                                        <Select.Option value="Macau">Macau</Select.Option >
                                        <Select.Option value="Macedonia">Macedonia, The Former Yugoslav Republic of</Select.Option >
                                        <Select.Option value="Madagascar">Madagascar</Select.Option >
                                        <Select.Option value="Malawi">Malawi</Select.Option >
                                        <Select.Option value="Malaysia">Malaysia</Select.Option >
                                        <Select.Option value="Maldives">Maldives</Select.Option >
                                        <Select.Option value="Mali">Mali</Select.Option >
                                        <Select.Option value="Malta">Malta</Select.Option >
                                        <Select.Option value="Marshall Islands">Marshall Islands</Select.Option >
                                        <Select.Option value="Martinique">Martinique</Select.Option >
                                        <Select.Option value="Mauritania">Mauritania</Select.Option >
                                        <Select.Option value="Mauritius">Mauritius</Select.Option >
                                        <Select.Option value="Mayotte">Mayotte</Select.Option >
                                        <Select.Option value="Mexico">Mexico</Select.Option >
                                        <Select.Option value="Micronesia">Micronesia, Federated States of</Select.Option >
                                        <Select.Option value="Moldova">Moldova, Republic of</Select.Option >
                                        <Select.Option value="Monaco">Monaco</Select.Option >
                                        <Select.Option value="Mongolia">Mongolia</Select.Option >
                                        <Select.Option value="Montserrat">Montserrat</Select.Option >
                                        <Select.Option value="Morocco">Morocco</Select.Option >
                                        <Select.Option value="Mozambique">Mozambique</Select.Option >
                                        <Select.Option value="Myanmar">Myanmar</Select.Option >
                                        <Select.Option value="Namibia">Namibia</Select.Option >
                                        <Select.Option value="Nauru">Nauru</Select.Option >
                                        <Select.Option value="Nepal">Nepal</Select.Option >
                                        <Select.Option value="Netherlands">Netherlands</Select.Option >
                                        <Select.Option value="Netherlands Antilles">Netherlands Antilles</Select.Option >
                                        <Select.Option value="New Caledonia">New Caledonia</Select.Option >
                                        <Select.Option value="New Zealand">New Zealand</Select.Option >
                                        <Select.Option value="Nicaragua">Nicaragua</Select.Option >
                                        <Select.Option value="Niger">Niger</Select.Option >
                                        <Select.Option value="Nigeria">Nigeria</Select.Option >
                                        <Select.Option value="Niue">Niue</Select.Option >
                                        <Select.Option value="Norfolk Island">Norfolk Island</Select.Option >
                                        <Select.Option value="Northern Mariana Islands">Northern Mariana Islands</Select.Option >
                                        <Select.Option value="Norway">Norway</Select.Option >
                                        <Select.Option value="Oman">Oman</Select.Option >
                                        <Select.Option value="Pakistan">Pakistan</Select.Option >
                                        <Select.Option value="Palau">Palau</Select.Option >
                                        <Select.Option value="Panama">Panama</Select.Option >
                                        <Select.Option value="Papua New Guinea">Papua New Guinea</Select.Option >
                                        <Select.Option value="Paraguay">Paraguay</Select.Option >
                                        <Select.Option value="Peru">Peru</Select.Option >
                                        <Select.Option value="Philippines">Philippines</Select.Option >
                                        <Select.Option value="Pitcairn">Pitcairn</Select.Option >
                                        <Select.Option value="Poland">Poland</Select.Option >
                                        <Select.Option value="Portugal">Portugal</Select.Option >
                                        <Select.Option value="Puerto Rico">Puerto Rico</Select.Option >
                                        <Select.Option value="Qatar">Qatar</Select.Option >
                                        <Select.Option value="Reunion">Reunion</Select.Option >
                                        <Select.Option value="Romania">Romania</Select.Option >
                                        <Select.Option value="Russia">Russian Federation</Select.Option >
                                        <Select.Option value="Rwanda">Rwanda</Select.Option >
                                        <Select.Option value="Saint Kitts and Nevis">Saint Kitts and Nevis</Select.Option >
                                        <Select.Option value="Saint LUCIA">Saint LUCIA</Select.Option >
                                        <Select.Option value="Saint Vincent">Saint Vincent and the Grenadines</Select.Option >
                                        <Select.Option value="Samoa">Samoa</Select.Option >
                                        <Select.Option value="San Marino">San Marino</Select.Option >
                                        <Select.Option value="Sao Tome and Principe">Sao Tome and Principe</Select.Option >
                                        <Select.Option value="Saudi Arabia">Saudi Arabia</Select.Option >
                                        <Select.Option value="Senegal">Senegal</Select.Option >
                                        <Select.Option value="Seychelles">Seychelles</Select.Option >
                                        <Select.Option value="Sierra">Sierra Leone</Select.Option >
                                        <Select.Option value="Singapore">Singapore</Select.Option >
                                        <Select.Option value="Slovakia">Slovakia (Slovak Republic)</Select.Option >
                                        <Select.Option value="Slovenia">Slovenia</Select.Option >
                                        <Select.Option value="Solomon Islands">Solomon Islands</Select.Option >
                                        <Select.Option value="Somalia">Somalia</Select.Option >
                                        <Select.Option value="South Africa">South Africa</Select.Option >
                                        <Select.Option value="South Georgia">South Georgia and the South Sandwich Islands</Select.Option >
                                        <Select.Option value="Span">Spain</Select.Option >
                                        <Select.Option value="SriLanka">Sri Lanka</Select.Option >
                                        <Select.Option value="St. Helena">St. Helena</Select.Option >
                                        <Select.Option value="St. Pierre and Miguelon">St. Pierre and Miquelon</Select.Option >
                                        <Select.Option value="Sudan">Sudan</Select.Option >
                                        <Select.Option value="Suriname">Suriname</Select.Option >
                                        <Select.Option value="Svalbard">Svalbard and Jan Mayen Islands</Select.Option >
                                        <Select.Option value="Swaziland">Swaziland</Select.Option >
                                        <Select.Option value="Sweden">Sweden</Select.Option >
                                        <Select.Option value="Switzerland">Switzerland</Select.Option >
                                        <Select.Option value="Syria">Syrian Arab Republic</Select.Option >
                                        <Select.Option value="Taiwan">Taiwan, Province of China</Select.Option >
                                        <Select.Option value="Tajikistan">Tajikistan</Select.Option >
                                        <Select.Option value="Tanzania">Tanzania, United Republic of</Select.Option >
                                        <Select.Option value="Thailand">Thailand</Select.Option >
                                        <Select.Option value="Togo">Togo</Select.Option >
                                        <Select.Option value="Tokelau">Tokelau</Select.Option >
                                        <Select.Option value="Tonga">Tonga</Select.Option >
                                        <Select.Option value="Trinidad and Tobago">Trinidad and Tobago</Select.Option >
                                        <Select.Option value="Tunisia">Tunisia</Select.Option >
                                        <Select.Option value="Turkey">Turkey</Select.Option >
                                        <Select.Option value="Turkmenistan">Turkmenistan</Select.Option >
                                        <Select.Option value="Turks and Caicos">Turks and Caicos Islands</Select.Option >
                                        <Select.Option value="Tuvalu">Tuvalu</Select.Option >
                                        <Select.Option value="Uganda">Uganda</Select.Option >
                                        <Select.Option value="Ukraine">Ukraine</Select.Option >
                                        <Select.Option value="United Arab Emirates">United Arab Emirates</Select.Option >
                                        <Select.Option value="United Kingdom">United Kingdom</Select.Option >
                                        <Select.Option value="United States">United States</Select.Option >
                                        <Select.Option value="United States Minor Outlying Islands">United States Minor Outlying Islands</Select.Option >
                                        <Select.Option value="Uruguay">Uruguay</Select.Option >
                                        <Select.Option value="Uzbekistan">Uzbekistan</Select.Option >
                                        <Select.Option value="Vanuatu">Vanuatu</Select.Option >
                                        <Select.Option value="Venezuela">Venezuela</Select.Option >
                                        <Select.Option value="Vietnam">Viet Nam</Select.Option >
                                        <Select.Option value="Virgin Islands (British)">Virgin Islands (British)</Select.Option >
                                        <Select.Option value="Virgin Islands (U.S)">Virgin Islands (U.S.)</Select.Option >
                                        <Select.Option value="Wallis and Futana Islands">Wallis and Futuna Islands</Select.Option >
                                        <Select.Option value="Western Sahara">Western Sahara</Select.Option >
                                        <Select.Option value="Yemen">Yemen</Select.Option >
                                        <Select.Option value="Serbia">Serbia</Select.Option >
                                        <Select.Option value="Zambia">Zambia</Select.Option >
                                        <Select.Option value="Zimbabwe">Zimbabwe</Select.Option >
                                    </Select>
                                </Form.Item>


                            </Form>
                        </div>


                        <div className="searchBt">

                            <FontAwesomeIcon icon={faSearch} size="lg"
                                // au clic, lancer la recherche de capsules en BDD
                                onClick={() => handleSubmitSearch()}
                            />
                        </div>


                    </div>

                </div>
            </Row>



            <Row className="capsuleRow capsuleRowSearch">
                <div className="ColForm" >

                    {/* messages d'erreur */}
                    {Errors}

                    {/* messages d'absenced de données en BDD */}
                    {noCapsule}

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
                                    <FontAwesomeIcon icon={faHeart} size="lg" color='red' id="button"
                                        // au clic, ajout aux favoris 
                                        onClick={() => handleSuppFavorite(capsule.capsuleRef)}
                                    />
                                }
                                {token != '' && !favorites.includes(capsule.capsuleRef) &&
                                    <FontAwesomeIcon icon={faHeart} size="lg" color='grey' id="button"
                                        // au clic, suppression des favoris 
                                        onClick={() => handleAddFavorite(capsule.capsuleRef)}
                                    />
                                }
                                {token == '' &&
                                    <FontAwesomeIcon icon={faHeart} size="lg" color='grey' id="button"
                                        // au clic, ouverture du pop up d'avertissement
                                        onClick={() => handleModalNoAccess()}
                                    />
                                }

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
)(Research)