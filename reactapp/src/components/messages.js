// importation à partir de libraries
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Row, Typography, Tag, Input, Form, Button } from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/messages.css';


function Messages(props) {

    // Etats
    const [token, setToken] = useState(props.token)     // état du token, récupéré du Redux Store
    const [discussionsList, setDiscussionsList] = useState([])
    const [interaction, setInteraction] = useState(0)
    const [listErrorsMessages, setErrorsMessages] = useState([])
    const [discussionOpenedRef, setdiscussionOpenedRef] = useState('')
    const [discussionMessagesOpened, setdiscussionMessagesOpened] = useState([])
    const [myNewMsg, setmyNewMsg] = useState('')
    const [positiveResult, setpositiveResult] = useState(false)
    const [timeOff, setTimeOff] = useState(false)
    const [resultFromBack, setresultFromBack] = useState(false)


    // échange de données avec le back pour la récuration des données à chaque changement de l'état interaction
    useEffect(() => {
        const findDiscussions = async () => {
            const data = await fetch(`/discussions?token=${token}`) // pour récupérer des données 
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setErrorsMessages(body.error)
            setpositiveResult(body.result)
            setDiscussionsList(body.sortedDiscussions)
            setdiscussionMessagesOpened(body.sortedDiscussions[0].messages)
            setdiscussionOpenedRef(body.sortedDiscussions[0].discussionRef)
            props.newMessage(false)
            if (body.sortedDiscussions) { setresultFromBack(true) }
        }
        findDiscussions()
    }, [interaction])

    // fonction d'ajout d'un message en base de données
    const submitMessage = async () => {
        if (myNewMsg.length > 0) {
            const data = await fetch('/new-message', {
                method: 'POST', // méthode pour ajouter en BDD
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `discussionRef=${discussionOpenedRef}&token=${token}&newMessage=${myNewMsg}`
            })
            // convertion des données reçues en objet JS (parsage)
            const body = await data.json()
            if (body.updated == true) {
                setInteraction(interaction + 1)
                document.getElementById('chat').scrollTo(0, 0)
            }
        }
    }

    const changeDiscussion = (discRef) => {
        var selectedDiscussion = discussionsList.filter(
            discussion => {
                return discussion.discussionRef === discRef
            }
        )
        setdiscussionMessagesOpened(selectedDiscussion[0].messages)
        setdiscussionOpenedRef(selectedDiscussion[0].discussionRef)
    }

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

    // mise en forme des titres antd
    const { Title } = Typography;

    
    var noMessage
    if (!resultFromBack) {
        // message d'attente tant que les données en BDD ne sont pas chargées
        noMessage = <h4 className="noMessage">On cherche pour vous...</h4>
    }
    // message en cas d'absence de données enregistrée pour l'instant
    if (resultFromBack && discussionsList == 0 && listErrorsMessages.length == 0) {
        noMessage = <h4 className="noMessage">Aucun message</h4>
    }
    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsMessages = listErrorsMessages.map((error, i) => {
        return (
            <div className="problemNotif">
                {error}
            </div>
        )
    })

    const [form] = Form.useForm();

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

                    {positiveResult == false &&
                        <div style={{ height: "452px" }} >
                            {/* messages d'erreur */}
                            {tabErrorsMessages}

                            {/* messages d'absence de données en BDD */}
                            {noMessage}
                        </div>
                    }


                    {positiveResult == true &&

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

                                                    <img className="imgCapsuleDiscussion" src={discussion.capsuleData.photo} alt="une capsule" width="50px" />

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

                                                    <img className="imgCapsuleDiscussion" src={discussion.capsuleData.photo} alt="une capsule" width="50px" />

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
        // newMessage: state.newMessage
    }
}

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