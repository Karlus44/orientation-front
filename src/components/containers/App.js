import React, { Component } from 'react';
import Navigation from '../Navigation/Navigation';
import SignIn from '../SignIn/SignIn';
import Register from '../Register/Register';
import GestionTableau from '../GestionTableau/GestionTableau';
import GestionTableauFichiers from '../GestionTableauFichiers/GestionTableauFichiers';
import Documents from '../Documents/Documents';
import Profile from '../Profile/Profile';
import Historique from '../Historique/Historique';
import Scroll from '../Scroll/Scroll';
import './App.css';


const initialState = {
  route:'signin',
  isSignedIn: false,
  isEmpty: false,
  user: {
    id: '',
    prénom: '',
    nom: '',
    classe: '',
    mail: '',
    admin: false,
    autoeval: {},
    resp: {}
  },
  Navbar: {'profile':false,'gestion':false,'home':false,'signin':true,'register':false},
  cocheListFiles:{}
}



class App extends Component {

  constructor(){
    super();
    this.state = initialState;
  }

  componentDidMount(){
    fetch('https://orientation-back.herokuapp.com/testempty',{
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(x => this.setState({
      route: x ? 'register' : 'signin',
      isEmpty:x,
      Navbar: x ? {'profile':false,'gestion':false,'home':false, 'historique':false,'signin':false,'register':true} : {'profile':false,'gestion':false,'home':false,'historique':false,'signin':true,'register':false}
    })
  )
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      prénom: data.prénom,
      nom: data.nom,
      classe: data.classe,
      mail: data.mail,
      admin: data.admin,
      resp: data.resp,
      autoeval: data.autoeval
    }})
  }

  setVide = (x) => {
    this.setState({
      isEmpty:x
    });
    console.log(x);
  }

  recordCocheListFiles = (x) => {
    // this.setState({cocheListFiles:x});
    console.log(x);
  }

  onRouteChange = (route) => {
    this.setState({Navbar: {'profile':false,'gestion':false,'home':false,'historique':false,'signin':false,'register':false}});
    console.log(this.state.isEmpty);
    if (this.state.isEmpty) { route = 'register'};
    if (route === 'signin') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
    this.setState(prevState => ({
      Navbar: {
        ...prevState.Navbar,
        [route]:true
      }
    }));
    console.log(this.state.Navbar);
  }

  render () {
  const { isEmpty, isSignedIn, route, user, Navbar } = this.state;
  return (
    <div className="App">
    <Navigation isEmpty={isEmpty} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} user={user} Navbar={Navbar}/>
      <Scroll>
        {
          {
            'signin': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>,
            'register': <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} setVide={this.setVide}/>,
            'home':<div>
                    {(user.classe === "Prof") ?
                      < Documents user={this.state.user} />
                    : null}
                    < GestionTableauFichiers
                      colnames={user.classe === 'Prof' ? ["Auteur","Nom","Description","Notes"] : ["Auteur","Nom","Description"]}
                      properties={["Auteur","Nom","Description","Notes","Mail","Lien"]}
                      user={this.state.user}
                      idx={6}
                      type={user.classe === 'Prof' ? 'files-prof' : 'files-eleve'}
                    />
                  {(Object.keys(user.resp).length !== 0) ?
                      < GestionTableau
                          colnames={["Prénom","Nom","Classe","Mail"]}
                          properties={["Prénom","Nom","Classe","Mail","autoeval"]}
                          user={this.state.user}
                          idx={3}
                          type={'pp-data'}
                          // cocheListFiles={this.state.cocheListFiles}
                          />
                    : null}
                  </div>,
              'profile':< Profile user={user} loadUser={this.loadUser}/>,
              'gestion':<div>
                            < GestionTableau
                            colnames={["Prénom","Nom","Classe","Mail","Mot de passe initial"]}
                            properties={["Prénom","Nom","Classe","Mail","InitialPassword"]}
                            user={this.state.user}
                            idx={3}
                            type={'admin-file'}
                            />
                            < GestionTableau
                            colnames={["Prénom","Nom","Classe","Mail","Mot de passe initial"]}
                            properties={["Prénom","Nom","Classe","Mail","InitialPassword","admin","resp","autoeval"]}
                            user={this.state.user}
                            idx={3}
                            type={'admin-data'}
                            loadUser={this.loadUser}
                            />
                            < GestionTableauFichiers
                            colnames={["Auteur","Nom","Description","Notes"]}
                            properties={["Auteur","Nom","Description","Notes","Mail","Lien"]}
                            user={this.state.user}
                            idx={6}
                            type={'files-admin'}
                            />
                          </div>,
                          'historique':< Historique
                            user={this.state.user}
                            />,
          }[route]
        }
      </Scroll>
      </div>
    );
}
}

export default App;
