import React, {useState, useEffect } from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Row, Col, Typography, Tag, Form, Select} from 'antd';
import { ResponsiveBar } from '@nivo/bar'

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';


function History(props) {

// Etats

    // état du token, récupéré du Redux Store
    const [token, setToken] = useState(props.token)
    const [dataStats, setDataStats] = useState([])
    const [listErrorsSaving, setErrorsSaving] = useState([])

    const [groupMode, setGroupMode] = useState('grouped')
    function onChangeAlignement(value) {
        setGroupMode(value);
    }

    const [dataFormat, setDataFormat] = useState('distance')
    function onChangeDataFormat (value) {
        setDataFormat(value);
    }

    const [tickValuesCondition, setTickValuesCondition] = useState([])

    const [timeGap, setTimeGap] = useState('mensuel')
    function onChangeTimeGap (value) {
        setTimeGap(value);
    }

    var yearNow = new Date().getFullYear() - 1900
    const [yearChosen, setYearChosen] = useState(yearNow)
    function onChangeYear(value) {
        setYearChosen(value);
    }

    var monthNow = new Date().getMonth()
    const [monthChosen, setMonthChosen] = useState(monthNow)
    function onChangeMonth(value) {
        setMonthChosen(value);
    }

    const [legende, setLegende] = useState('kilomètres')

    const [noDocument, setNoDocument] = useState(true)
    
    // échange de données avec le back pour récupérer les données par fonction asynchrone. le await indique qu'il faut attendre le retour des données pour terminer la fonction
    useEffect(() => {
        const findActivities = async () => {
        const data = await fetch(`/stats?token=${token}&yearChosen=${yearChosen}&monthChosen=${monthChosen}&dataFormat=${dataFormat}&timeGap=${timeGap}`)
        const body = await data.json() // convertion des données reçues en objet JS (parsage)

        setDataStats(body.stats)
        setErrorsSaving(body.error)
        setNoDocument(body.noDocument)

        }

        findActivities()

        // changement de la légende en fonction des données affichées
        if (dataFormat == 'distance') {
            setLegende('')
        }
        if (dataFormat == 'distance') {
            setLegende('kilomètres')
        }
        if (dataFormat == 'temps') {
            setLegende('heures')
        }
        if (dataFormat == 'vitesse') {
            setLegende('km / h')
        }
        if (dataFormat == 'rythme') {
            setLegende('min / km')
        }

        // changement des indices en fonction des données affichées
        if (timeGap == 'hebdomadaire' && monthChosen == 12) {
            setTickValuesCondition ([1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50])
        }
        else if (timeGap == 'journalier' && monthChosen == 12) {
            setTickValuesCondition ([1, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360])
        } 
        else { 
            setTickValuesCondition (null)
        }

    },[yearChosen, monthChosen, dataFormat, timeGap])

    // message en cas d'absence de données enregistrée pour l'instant
    var noActivity = ''
    if(noDocument == true && listErrorsSaving.length == 0){
        noActivity = <h4 style={{display:'flex', margin:"30px", marginBottom:"50px", justifyContent:'center', color: 'red'}}>Aucune activité enregistrée</h4>
    }
        
    // mise en forme des titres antd
    const { Title } = Typography;

    // messages d'erreurs rencontrées en back-end lors de l'enregistrement
    var tabErrorsSaving = listErrorsSaving.map((error,i) => {
        return( <h4 style={{display:'flex', margin:"30px", marginBottom:"50px", justifyContent:'center', color: 'red'}}
                > 
                {error}
                </h4>
              )
        })

    // graphique en barre de Nivo
  const Graph = () => { 
    return ( 
        <ResponsiveBar

            // données récupérées du back  intégré dans le graph
            data={dataStats}

            groupMode= {groupMode}
            keys={[ 'varié', 'fractionné', 'endurance', 'compétition' ]}
            indexBy="légende"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'white',
                    size: 2,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 8,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'varié'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'endurance'
                    },
                    id: 'lines'
                }

            ]}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 4,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32,
                tickValues: tickValuesCondition,
            }}

            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: legende,
                legendPosition: 'middle',
                legendOffset: -40,   
            }}

            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
}
  
    // condition de rediction en cas d'absence de token 
        if(token == ''){
            return <Redirect to='/notlogged' />
            }   


            
    return (
        // le style de la page de login est dans css/other.css
  
        <Layout className= "activityLayout">

            <Topnavbar/>

                    
                <Row className="historyRow">
                  <div className="ColStats" >
                    
                    {/* messages d'erreur */}
                    {tabErrorsSaving}

                    {/* messages d'absenced de données en BDD */}
                    {noActivity}


                    {/* si des données sont récupérée du back alors le graph s'affiche */}
                    {noDocument == false && (
                        <Graph/>
                    )}

                    <div>


                    </div>

                  </div>
                
                </Row>

                <Row className="RowParam">
                  <Col className="ColWrapperParam" >

                        <div className="ColParam"
                        >
                            {/*critères pour changer les données et l'apparence du graph */}
                            <Form
                            style = {{
                                position:  'relative',
                                top: '11px',
                            }}
                            >   
                            <Form.Item >
                                    <Select 
                                        placeholder="Données"
                                        onChange={onChangeDataFormat}
                                    >
                                        <Select.Option value="distance">Distance</Select.Option>
                                        <Select.Option value="temps">Temps</Select.Option>
                                        <Select.Option value="vitesse">Vitesse</Select.Option>
                                        <Select.Option value="rythme">Rythme</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>

                        <div className="ColParam"
                        >
                            <Form
                            style = {{
                                position:  'relative',
                                top: '11px',
                            }}
                            >   
                            <Form.Item >
                                    <Select 
                                        placeholder="Présentation"
                                        onChange={onChangeAlignement}
                                    >
                                        <Select.Option value="stacked">Alignés</Select.Option>
                                        <Select.Option value="grouped">Parallèles</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>



                        <div className="ColParam"
                        >
                            <Form
                            style = {{
                                position:  'relative',
                                top: '11px',
                                width: '135px',
                            }}
                            >   
                            <Form.Item >
                                    <Select 
                                        placeholder="Intervalle"
                                        onChange={onChangeTimeGap}
                                    >
                                        <Select.Option value="mensuel">Mensuel</Select.Option>
                                        <Select.Option value="hebdomadaire">Hebdomadaire</Select.Option>
                                        <Select.Option value="journalier">Journalier</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>

                        <div className="ColParam"
                        >
                            <Form
                            style = {{
                                position:  'relative',
                                top: '11px',
                                width: '109px',
                            }}
                            >   
                            <Form.Item >
                                    <Select 
                                        placeholder="mois"
                                        onChange={onChangeMonth}
                                    >
                                        <Select.Option value="12">tous</Select.Option>
                                        <Select.Option value="0">janvier</Select.Option>
                                        <Select.Option value="1">février</Select.Option>
                                        <Select.Option value="2">mars</Select.Option>
                                        <Select.Option value="3">avril</Select.Option>
                                        <Select.Option value="4">mai</Select.Option>
                                        <Select.Option value="5">juin</Select.Option>
                                        <Select.Option value="6">juillet</Select.Option>
                                        <Select.Option value="7">août</Select.Option>
                                        <Select.Option value="8">septembre</Select.Option>
                                        <Select.Option value="9">octobre</Select.Option>
                                        <Select.Option value="10">novembre</Select.Option>
                                        <Select.Option value="11">décembre</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>

                        <div className="ColParam"
                        >
                            <Form
                            style = {{
                                position:  'relative',
                                top: '11px',
                            }}
                            >   
                            <Form.Item >
                                    <Select 
                                        defaultValue ={"2021"}
                                        placeholder="année"
                                        onChange={onChangeYear}
                                    >
                                        <Select.Option value="121">2021</Select.Option>
                                        <Select.Option value="120">2020</Select.Option>
                                        <Select.Option value="119">2019</Select.Option>
                                        <Select.Option value="118">2018</Select.Option>
                                        <Select.Option value="117">2017</Select.Option>
                                        <Select.Option value="116">2016</Select.Option>
                                        <Select.Option value="115">2015</Select.Option>
                                        <Select.Option value="114">2014</Select.Option>
                                        <Select.Option value="113">2013</Select.Option>
                                        <Select.Option value="112">2012</Select.Option>
                                        <Select.Option value="111">2011</Select.Option>
                                        <Select.Option value="110">2010</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>

                  </Col>
                
                </Row>
                

            <Footer/>

        </Layout>
  
    );
  }

// fonction de récupération de données dans le Redux Store 
function mapStateToProps(state){
return {token: state.token}
}

export default connect(
mapStateToProps,
null
)(History)