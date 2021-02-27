// import de fonctionnalités à partir de libraries/bibliothèques
import React, { useState, useEffect } from 'react' // bibliothèque de création de composants
import { Redirect } from 'react-router-dom' // bibliothèque de liaison entre les composants
import { connect } from 'react-redux' // bibliothèque de gestion d'état 
import { Layout, Row, Typography, Tag, Input, Form, Button } from 'antd'; // bibliothèque d'interface graphique

//composants créés ailleurs et importés
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/messages.css';

//image
import capsuleAlt from '../images/capsule-alt.png';

// composant prenant pour seul argument props (grâce auquel les données transitent entre le Redux Store et le composant. Voir functions mapDispatchToProps et mapStateToProps en bas de fichier)
function Messages(props) {

    // Etats avec leurs valeurs initiales à l'inialisation du composant 
    const [token, setToken] = useState(props.token)     // état du token, récupéré du Redux Store
    const [discussionsList, setDiscussionsList] = useState([])
    const [interaction, setInteraction] = useState(0)
    const [listErrorsMessages, setErrorsMessages] = useState([])
    const [discussionOpenedRef, setdiscussionOpenedRef] = useState('')
    const [discussionMessagesOpened, setdiscussionMessagesOpened] = useState([])
    const [myNewMsg, setmyNewMsg] = useState('')
    const [positiveResult, setpositiveResult] = useState(false)
    const [resultFromBack, setresultFromBack] = useState(false)
    const [existingDiscussions, setexistingDiscussions] = useState(false)


    useEffect(() => { // le hook d'effet se déclenchera à chaque mise à jour d'un de l'état interaction
        const findDiscussions = async () => {
            const data = await fetch(`/discussions?token=${token}`) // communication avec le back sur cette route avec la méthode GET
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setErrorsMessages(body.error) // erreurs éventuellement rencontrées en Back
            setpositiveResult(body.result) // indication de la validation de l'opération en BDD
            setexistingDiscussions(body.isDiscussionsExist)
            setDiscussionsList(body.sortedDiscussions)  // récupération des données des discussions
            if (body.sortedDiscussions != null) { // si les données des discussions existent alors ...
                setdiscussionMessagesOpened(body.sortedDiscussions[0].messages) // préparation de l'affichage avec la discussion ouverte par défaut
                setdiscussionOpenedRef(body.sortedDiscussions[0].discussionRef)
                props.newMessage(false) // transmission au Redux Store du changement de valeur relatif au fait qu'il n'y a plus de nouveau message
                setresultFromBack(true)
            }
        }
        findDiscussions() // appel de la fonction
    }, [interaction]) // le hook d'effet se déclenchera à chaque mise à jour d'un de cet état

    // envoi de message au clic sur le bouton "Envoyer"
    const submitMessage = async () => {
        if (myNewMsg.length > 0) { // condition d'envoi, le message ne doit pas être vide
            const data = await fetch('/new-message', { // communication avec le back sur cette route 
                method: 'POST', // méthode pour ajouter en BDD
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `discussionRef=${discussionOpenedRef}&token=${token}&newMessage=${myNewMsg}`  // données envoyées au Back
            })

            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            if (body.updated == true) { // // si réponse positive du back alors ...
                setInteraction(interaction + 1) // mise à jour de l'état, ce qui déclenche le hook d'effet
                document.getElementById('chat').scrollTo(0, 0) // déroulement de la fenêtre jusqu'au message le plus récent
            }
        }
    }

    // au clic sur une discussion, récupération de l'identifant de cette discussion
    const changeDiscussion = (discRef) => {
        var selectedDiscussion = discussionsList.filter(
            discussion => {
                return discussion.discussionRef === discRef
            }
        )
        setdiscussionMessagesOpened(selectedDiscussion[0].messages) // récupération des données liées à cette discussion
        setdiscussionOpenedRef(selectedDiscussion[0].discussionRef)
    }

    // mise en page du chat à partir du tableau de discussion 
    var chatMessages = discussionMessagesOpened.map((message, i) => {
        if (message.token === token) {
            return (
                <div className="myMessageWrapper">
                    <div className="myMessage">
                        {message.message}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="hisMessageWrapper">
                    <div className="hisMessage">
                        {message.message}
                    </div>
                </div>
            )
        }
    })

    // mise en forme des titres via antd
    const { Title } = Typography;


    // message d'attente tant que les données en BDD ne sont pas chargées
    var noMessage
    if (!resultFromBack) {
        noMessage = <h4 className="problemNotif">On rassemble les données pour vous...</h4>
    }

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsMessages = listErrorsMessages.map((error, i) => {
        return (
            <div className="problemNotif">
                {error}
            </div>
        )
    })

    // configuration du formulaire 
    const [form] = Form.useForm();

    // vidage des champs de saisie après envoi des données au back
    const onSubmit = (values) => {
        form.resetFields()
        setmyNewMsg('')
    }


    // condition de rediction en cas d'absence de token 
    if (token == '') {
        return <Redirect to='/notlogged' />
    }

    return (
        // le style de la page history est dans css/messages.css

        <Layout className="messageLayout">

            <Topnavbar />

            <Row className="messageRow">
                <div className="mainFrameChat" >

                    <Title level={6} className="titleMessage">
                        Echangeons entre passionnés
                    </Title>

                    {positiveResult == false || existingDiscussions == false &&
                        <div style={{ height: "452px" }} >
                            {/* messages d'erreur */}
                            {tabErrorsMessages}
                        </div>
                    }
                    {positiveResult == false &&
                        <div style={{ height: "452px" }} >
                            {/* messages d'attente */}
                            {noMessage}
                        </div>
                    }


                    {existingDiscussions === true &&

                        <div className="techPart">



                            <div className="leftPanelChat">

                                {/* map du tableau de données */}
                                {discussionsList.map((discussion, i) => (

                                    <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>


                                        {discussionOpenedRef == discussion.discussionRef &&
                                            <div className="containerDiscussionSelected" id="hover">

                                                <div className="eachDiscussion"
                                                    onClick={() => changeDiscussion(discussion.discussionRef)}
                                                >

                                                    {discussion.capsuleData.photo == ''
                                                        ? <img className="imgCapsuleDiscussion" src={capsuleAlt} alt="une capsule" width="50px" />
                                                        : <img className="imgCapsuleDiscussion" src={discussion.capsuleData.photo} alt="une capsule" width="50px" />
                                                    }

                                                    <div className="presentationDataMsg">
                                                        <div>
                                                            <Tag color="rgba(81,97,119,1)">{discussion.capsuleData.brand}</Tag>
                                                        </div>
                                                        <div className="presentationDataSecond">

                                                            <Tag color="rgba(81,97,119,1)"> {discussion.capsuleData.year}</Tag>

                                                            <Tag color="rgba(81,97,119,1)"> {discussion.capsuleData.country}</Tag>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        }

                                        {discussionOpenedRef != discussion.discussionRef &&

                                            <div className="containerDiscussion" id="hover">

                                                <div className="eachDiscussion"
                                                    onClick={() => changeDiscussion(discussion.discussionRef)}
                                                >

                                                    {discussion.capsuleData.photo == ''
                                                        ? <img className="imgCapsuleDiscussion" src={capsuleAlt} alt="une capsule" width="50px" />
                                                        : <img className="imgCapsuleDiscussion" src={discussion.capsuleData.photo} alt="une capsule" width="50px" />
                                                    }

                                                    <div className="presentationDataMsg">
                                                        <div>
                                                            <Tag color="rgba(81,97,119,0.3)">{discussion.capsuleData.brand}</Tag>
                                                        </div>
                                                        <div className="presentationDataSecond">

                                                            <Tag color="rgba(81,97,119,0.3)"> {discussion.capsuleData.year}</Tag>

                                                            <Tag color="rgba(81,97,119,0.3)"> {discussion.capsuleData.country}</Tag>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        }

                                    </div>

                                ))}


                            </div>

                            <div className="verticalSpaceChat">
                            </div>

                            <div className="rightWindowChat">

                                <div className="chatBox" id="chat">

                                    <div className="informativeMessages">

                                        {/* messages d'erreur */}
                                        {tabErrorsMessages}

                                        {/* messages d'absence de données en BDD */}
                                        {noMessage}
                                    </div>

                                    <div className="messagesWrapper">
                                        <div className="message">

                                            {chatMessages}
                                        </div>
                                    </div>


                                </div>

                                <div className="horizontalSpaceChat">
                                </div>

                                <div className="inputMessage" >


                                    <Form
                                        layout="inline"
                                        form={form}
                                        onFinish={onSubmit}
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            textAlign: "left",
                                            justifyContent: 'right'
                                        }}
                                    >
                                        <Form.Item
                                            name="message"
                                            style={{
                                                width: '83%',
                                                textAlign: "left",
                                                bottom: '0px',
                                            }}
                                        >
                                            <Input
                                                placeholder={"votre message"}
                                                onChange={(e) => setmyNewMsg(e.target.value)}
                                            />
                                        </Form.Item>

                                        <div className="layerButton">
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit"
                                                    style={{
                                                        width: '100px',
                                                        justifyContent: 'right',
                                                    }}
                                                    onClick={() => submitMessage()}
                                                >
                                                    Envoyer
                                        </Button>
                                            </Form.Item>
                                        </div>
                                    </Form>
                                </div>
                            </div>
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
    return {
        token: state.token,
    }
}

// fonction d'envoi de données dans le Redux Store 
function mapDispatchToProps(dispatch) {
    return {
        newMessage: function (newMessage) {
            dispatch({ type: 'changeStatus', newMessage: newMessage })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages)