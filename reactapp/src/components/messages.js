import React, { useState, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Row, Typography, Tag, Input, Form, Button } from 'antd';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/messages.css';

// icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function Messages(props) {

    // Etats

    // état du token, récupéré du Redux Store
    const [token, setToken] = useState(props.token)
    const [discussionsList, setDiscussionsList] = useState([])
    const [interaction, setInteraction] = useState(0)
    const [listErrorsMessages, setErrorsMessages] = useState([])
    const [discussionOpenedRef, setdiscussionOpenedRef] = useState('')
    const [discussionMessagesOpened, setdiscussionMessagesOpened] = useState([])
    const [myNewMsg, setmyNewMsg] = useState('')
    const [discussionUpdated, setdiscussionUpdated] = useState(false)


    // échange de données avec le back pour la récuration des données à chaque changement de l'état interaction
    useEffect(() => {
        const findDiscussions = async () => {
            const data = await fetch(`/discussions?token=${token}`) // pour récupérer des données 
            const body = await data.json() // convertion des données reçues en objet JS (parsage)
            setDiscussionsList(body.sortedDiscussions)
            setdiscussionMessagesOpened(body.sortedDiscussions[0].messages)
            setdiscussionOpenedRef(body.sortedDiscussions[0].discussionRef)
            setErrorsMessages(body.error)
            // console.log('discussionMessagesOpened ----', discussionMessagesOpened);
            props.newMessage(false)
        }
        findDiscussions()
    }, [interaction])


    // fonction d'ajout d'un message en base de données
    const submitMessage = async () => {
        const data = await fetch('/new-message', {
            method: 'POST', // méthode pour ajouter en BDD
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `discussionRef=${discussionOpenedRef}&token=${token}&newMessage=${myNewMsg}`
        })
        // convertion des données reçues en objet JS (parsage)
        const body = await data.json()
        if (body.updated == true) {
            setInteraction(interaction + 1)
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

    // fonction de suppression d'une conversation en base de données
    // const deleteMessage = async (capsuleRef) => {
    //     const deleting = await fetch('/messages', {
    //         method: 'DELETE', // méthode pour supprimer en BDD
    //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //         body: `capsuleRef=${capsuleRef}&token=${token}`
    //     })

    //     setInteraction(interaction + 1)
    // }


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


    // message en cas d'absence de données enregistrée pour l'instant
    var noMessage
    if (discussionsList == 0 && listErrorsMessages.length == 0) {
        noMessage = <h4 style={{ display: 'flex', width: '100%', height: '100%', marginBottom: "20px", justifyContent: 'center', alignItems: 'center', color: 'red' }}>Aucun message</h4>
    }


    // mise en forme des titres antd
    const { Title } = Typography;

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsMessages = listErrorsMessages.map((error, i) => {
        return (<div style={{ display: 'flex', width: '100%', height: '100%', marginBottom: "20px", justifyContent: 'center', alignItems: 'center', color: 'red' }}
        >
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
    // if(token == ''){
    //     return <Redirect to='/notlogged' />
    //     }   

    return (
        // le style de la page history est dans css/messages.css

        <Layout className="messageLayout">

            <Topnavbar />

            <Row className="messageRow">
                <div className="mainFrameChat" >

                    <Title level={3} className="title">
                        Mes messages
                    </Title>


                    <div className="techPart">

                        <div className="leftPanelChat">

                            {/* map du tableau de données */}
                            {discussionsList.map((discussion, i) => (

                                <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>


                                    {discussionOpenedRef == discussion.discussionRef &&
                                    <div className="containerDiscussionSelected ">

                                    <div className="eachDiscussion"
                                        onClick={() => changeDiscussion(discussion.discussionRef)}
                                    >

                                        <img className="imgCapsuleDiscussion" src={discussion.capsuleData.photo} alt="une capsule" width="50px" />

                                        <div className="presentationData">

                                            <div>
                                                <Tag color="grey">{discussion.capsuleData.brand}</Tag>
                                                {/* rgb(255, 136, 107, 0.9) */}
                                            </div>
                                            <div className="presentationDataSecond">

                                                <Tag color="grey"> {discussion.capsuleData.year}</Tag>

                                                <Tag color="grey"> {discussion.capsuleData.country}</Tag>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                    }

                                    {discussionOpenedRef != discussion.discussionRef &&
                                    
                                    <div className="containerDiscussion">

                                        <div className="eachDiscussion"
                                            onClick={() => changeDiscussion(discussion.discussionRef)}
                                        >

                                            <img className="imgCapsuleDiscussion" src={discussion.capsuleData.photo} alt="une capsule" width="50px" />

                                            <div className="presentationData">

                                                <div>
                                                    <Tag color="grey">{discussion.capsuleData.brand}</Tag>
                                                    {/* rgb(255, 136, 107, 0.9) */}
                                                </div>
                                                <div className="presentationDataSecond">

                                                    <Tag color="grey"> {discussion.capsuleData.year}</Tag>

                                                    <Tag color="grey"> {discussion.capsuleData.country}</Tag>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    }


                                    {/* <div className="trashBt">
                                        <FontAwesomeIcon icon={faTrash} size="lg" color='grey'
                                        // au clic, ajout aux favoris 
                                        // onClick={() => handleSuppDiscussion(discussion.capsuleData.capsuleRef)}
                                        />
                                    </div> */}

                                </div>

                            ))}


                        </div>

                        <div className="verticalSpaceChat">
                        </div>

                        <div className="rightWindowChat">

                            <div className="chatBox">

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
                                            // width: '368px',
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

                </div>
                

            </Row>

            <div className="endDiv"></div>

            <Footer />

        </Layout>

    );
}

// fonction de récupération de données dans le Redux Store 
function mapStateToProps(state) {
    return { token: state.token,
        // newMessage: state.newMessage
       }
}

function mapDispatchToProps(dispatch){
    return {
      newMessage: function(newMessage){
        dispatch({type: 'changeStatus', newMessage: newMessage})
      }
    }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages)