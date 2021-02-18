import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Layout,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Select,
  DatePicker,
  InputNumber,
  Input,
  Modal,
  Upload,
  Space,
  message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';


import moment from 'moment';
import 'moment/locale/fr';

//composants
import Topnavbar from './navbar.js'
import Footer from './footer.js'

// style
import 'antd/dist/antd.css';
import '../css/other.css';


function Addcapsule(props) {


  // année actuelle
  var today = new Date();
  var yyyy = today.getFullYear();


  // Etats


  // état du token, récupéré du Redux Store
  const [token, setToken] = useState(props.token)

  const [year, setYear] = useState(yyyy)
  function onChangeYear(value) {
    setYear(value);
  }

  const [brand, setBrand] = useState('non renseigné')
  // function onChangeBrand(value) {
  //   setBrand(value);
  // }

  const [country, setCountry] = useState('France')
  function onChangeCountry(value) {
    setCountry(value);
  }

  const [fileList, setFileList] = useState([]);
  // function onChangePhoto({ fileList: newPhoto })
  const onChangePhoto = ({ fileList: newFileList, file }) => {
    setFileList(newFileList)
  };


  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const successRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };


  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Seulement un JPG ou un PNG peut être chargé');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }


  const [saved, setSaved] = useState(false)

  const [listErrorsSaving, setErrorsSaving] = useState([])

  const [form] = Form.useForm();

  const [fillingRequest, setfillingRequest] = useState('')




  // échange de données avec le back pour l'écriture en BDD
  var handleSubmitSaving = async () => {

    if (fileList.length > 0 && brand != 'non renseigné') {
      const data = await fetch('/save-capsule', {
        method: 'POST', // pour écrire des données en BDD
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `tokenFromFront=${token}&yearFromFront=${year}&brandFromFront=${brand}&countryFromFront=${country}&photoFromFront=${fileList[0].thumbUrl}`
      })

      // convertion des données reçues en objet JS (parsage)
      const body = await data.json()
      // si l'échange avec la BDD n'a fonctionné, récupérer le tableau d'erreurs venu du back
      if (body.result) {
        setSaved(true)
      } else {
        setErrorsSaving(body.error)
      }
    } else {
      // setfillingRequest(<p className="erreurs">Remplissez le formulaire</p>)
      setBrand('non renseigné')
      Modal.warning({
        content: 'Remplissez les informations nécessaires'
      });
    }

  }


  // si l'écriture en BDD s'est bien passée 
  useEffect(() => {
    // pop-up indiquant que l'écriture en BDD 
    if (saved == true) {
      Modal.success({
        content: 'Capsule correctement enregistrée',
      });
      //réinitialisation des états
      setYear(yyyy)
      setBrand('non renseigné')
      setCountry('France')
      setSaved(false)
      setFileList([])
      setfillingRequest([])
    }
  }, [saved])

  // mise en forme des titres antd
  const { Title } = Typography;

  // messages de non conformité pour les formulaires antd
  const validateMessages = {
    required: 'Saisissez votre ${label}',
  };

  // messages d'erreurs rencontrées en back-end lors de l'enregistrement
  var tabErrorsSaving = listErrorsSaving.map((error, i) => {
    return (<p className="erreurs">
      {error}
    </p>
    )
  })


  const onSubmit = (values) => {
    form.resetFields();
  }

  // condition de rediction en cas d'absence de token 
  if(token == ''){
    return <Redirect to='/notlogged' />
    }   


  return (
    // le style de la page newactivity est dans css/other.css

    <Layout className="researchLayout">

      <Topnavbar />


      <Row className="capsuleRow">
        <Col className="ColForm ColFormCapNew" >

          <Form
            form={form}
            validateMessages={validateMessages}
            name="basic"
            onFinish={onSubmit}
            span={5}
          // layout= "horizontal"
          // colon= "false"
          // preserve = "false"
          >

            <Title level={6} className="title">
              Une capsule à ajouter ?
            </Title>

            <Form.Item
              label="Marque"
              name="text"
            // noStyle="true"
            >

              <Input
                style={{
                  width: 150,
                  textAlign: "left"
                }}
                placeholder={"Gallia ou autre"}
                // onChange={onChangeBrand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Année de distribution"
              name="annee"
            >
              <InputNumber
                style={{
                  width: 150,
                  textAlign: "center"
                }}
                max={yyyy}
                pattern={"^[0-9]+$"}
                defaultValue={yyyy}
                onChange={onChangeYear}
              />
            </Form.Item>

            <Form.Item
              label="Pays d'origine"
              name="pays"
            >

              <Select
                style={{
                  width: 150,
                  textAlign: "left"
                }}
                defaultValue={"France"}
                onChange={onChangeCountry}
              >
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


            <Form.Item
              label="Photo de la capsule"
              name="photo"
              style={{
                paddingBottom: "30px",
              }}
            >
              <ImgCrop rotate

                style={{
                  width: 150,
                  textAlign: "left",
                }}
              >
                <Upload
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChangePhoto}
                  onPreview={onPreview}
                  customRequest={successRequest}
                  beforeUpload={beforeUpload}

                >
                  {fileList.length < 1 && 'Ajoutez une photo'}
                </Upload>
              </ImgCrop>

            </Form.Item>







            <Form.Item className="buttonNewCap">
              <Button className="buttonNewCap" type="primary" htmlType="submit" block className="button"
                onClick={() => handleSubmitSaving()}
              >
                Ajouter
              </Button>

              {tabErrorsSaving}
              {fillingRequest}


            </Form.Item>


          </Form>



        </Col>

      </Row>

      <Row className="endDiv">
      </Row>

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
)(Addcapsule)