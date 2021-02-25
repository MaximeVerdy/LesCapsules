import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

// import des éléments liés à Redux
import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'
import token from './reducers/token'
import newMessage from './reducers/newMessage'
import notif from './reducers/notif'

// import des composants
import Login from './components/login.js';
import Mycollection from './components/mycollection.js';
import MentionsLegales from './components/legalterms.js';
import Disconnected from './components/disconnected.js';
import NotLogged from './components/notlogged.js';
import Addcapsule from './components/addcapsule.js';
import Research from './components/research.js';
import Favorites from './components/favorites.js';
import Messages from './components/messages.js';
import Parameters from './components/parameters.js';
import Deleted from './components/deletedAccount.js';

//style
import './css/mainwrapper.css';

// création du store qui contiendra les états voulus dans les reducers
const store = createStore(combineReducers({token, newMessage, notif}))

// contrôle des états dans Redux. Permet juste leur affichage dans la console
// store.subscribe(() => console.log('CONSOLE LOG REDUX ----->', store.getState()))

function App() {


  return (

    // Le Redux store est rendu disponibre dans l'ensemble des composants qui sont wrappés ci dessous
    <Provider store={store}>

      {/* React Router permet la navigation entre les composants */}
      <Router>
        <div className="main-wrapper">
          <Switch>
            <Route component={Research} path="/research" exact />
            <Route component={Login} path="/" exact />
            <Route component={MentionsLegales} path="/mentionslegales" exact />
            <Route component={Mycollection} path="/mycollection" exact />
            <Route component={Disconnected} path="/disconnected" exact />
            <Route component={NotLogged} path="/notlogged" exact />
            <Route component={Addcapsule} path="/addcapsule" exact />
            <Route component={Favorites} path="/favorites" exact />
            <Route component={Messages} path="/messages" exact />
            <Route component={Parameters} path="/parameters" exact />
            <Route component={Deleted} path="/erased-account" exact />

          </Switch>
        </div>
      </Router>

    </Provider>

  );
}

export default App;
