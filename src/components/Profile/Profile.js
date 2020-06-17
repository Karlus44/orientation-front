import React from 'react';
import Autoevaluation from '../Autoevaluation/Autoevaluation';
import {text_connaissance, text_formations, text_techniques} from '../../constants.js';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousPassword: '',
      newPassword1: '',
      newPassword2: '',
      errorLogin: false,
      referents: null,
      connaissance:{
          value : 0,
          text : '',
          color : 'rgb(0,0,0)',
        },
      formations:{
          value : 0,
          text : '',
          color : 'rgb(0,0,0)',
        },
      techniques:{
          value : 0,
          text : '',
          color : 'rgb(0,0,0)',
        },
    }
  }

  componentDidMount(){
    this.ligneResp(this.props.user);
    console.log(this.props.user);
    this.setState({
      connaissance: this.props.user.autoeval.connaissance,
      formations: this.props.user.autoeval.formations,
      techniques: this.props.user.autoeval.techniques,
    })
  }

  onPreviousPasswordChange = (event) => {
    this.setState({previousPassword: event.target.value})
  }

  onNewPassword1Change = (event) => {
    this.setState({newPassword1: event.target.value})
  }

  onNewPassword2Change = (event) => {
    this.setState({newPassword2: event.target.value})
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.onSubmitChange()
    }
  }


  onSubmitChange = () => {
    console.log(this.state);
    if (this.state.newPassword1===this.state.newPassword2) {
    this.setState({errorLogin: false});
    fetch('https://orientation-back.herokuapp.com/changepassword',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          previousPassword:this.state.previousPassword,
          newPassword:this.state.newPassword1,
          mail:this.props.user.mail,
        })
      })
      .then(response => response.json())
      .then(response => alert(response.message))
    } else {
        this.setState({errorLogin: true});
    }

  }


  color = value => {
    if (value<50) { return 'rgb(255,'+ value*5.1 +',0)'}
    else { return 'rgb(' + (255-(value-50)*5.1)  + ',255,0)' }
  }

  handleChangeCursor = (string, liste, x) => {
    const value = parseInt(x.currentTarget.value);
    // console.log(value, Math.ceil(value/20));
    const color = this.color(value);
    const text = liste[Math.ceil(value/20)];
    const obj = {
      value: value,
      color: color,
      text: text
    }
    this.setState({
    [string]:obj
    });
  }

  handleChangeText = (string, liste, x, obj) => {
    const obj2 = {
      value: obj.value,
      color: obj.color,
      text: x.target.value
    }
    this.setState({[string]: obj2});  }


  onValideChangements = () => {
    fetch('https://orientation-back.herokuapp.com/validechangements',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        mail:this.props.user.mail,
        previousAutoeval: this.props.user.autoeval,
        autoeval:{
          connaissance: this.state.connaissance,
          formations: this.state.formations,
          techniques: this.state.techniques
        },
      })
    })
    .then(response => response.json())
    .then(response => {console.log(response);
                        return response})
    .then(response=>{
      if (response.status==='u')
      { var user=this.props.user;
        user.autoeval={
          connaissance: this.state.connaissance,
          formations: this.state.formations,
          techniques: this.state.techniques
        };
        console.log(user);
        this.props.loadUser(user)}
      else {console.log('Un problème est survenu')}
      }
    )
    // .then (user => {
    //   console.log(user);
    //   if (user.id) {
    //     this.props.loadUser(user);
    //     this.setState({errorLogin: false});
    //     this.props.onRouteChange('home');
    //   } else {
    //     this.setState({errorLogin: true});
    //   }
    // })
  }

  checkReferents = async user => {
    const response = await fetch('https://orientation-back.herokuapp.com/checkprofs',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        classe:this.props.user.classe
      })
    })
    .then(x => x.json());
    console.log(response);
    if (response.status!=='u') {console.log(response.message);} else {return response.liste.join(', ');}
  }


  ligneResp = async user => {
    if (user.classe==='Prof') {
      console.log(user.resp, typeof user.resp);
      console.log(Object.keys(user.resp).length);
      if (Object.keys(user.resp).length===0) {this.setState({referents: ''});}
      else{
        this.setState({
        referents: Object.keys(user.resp).join(', ')
      })
      }
    } else {
        const referents = await this.checkReferents(user);
        console.log(referents);
        this.setState({
          referents: referents
        })
    }
  }


  render () {

      // console.log(this.state);

      return(
        <div>
          <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <div>
            <p>{this.props.user.prénom} {this.props.user.nom}</p> <br />
            {this.props.user.classe==='Prof' ? null : (<div><p> {this.props.user.classe}</p> <br /></div>)}
            {this.props.user.classe==='Prof'&& this.state.referents !=='' ? (<div><p>Professeur référent de: {this.state.referents} </p></div>) : null}
            {this.props.user.classe !=='Prof' ? <div><p>Professeur(s) référent(s): {this.state.referents} </p></div> : null}
          </div>
        </article>
        {this.props.user.classe==='Prof' ? null :
        (<article className="br3 ba b--black-10 mv4 w-100 w-80-m w-80-l mw8 shadow-5 center">
          <div>
              <p>Donne un pourcentage de ton avancement sur chacun de ces domaines.</p>
              <div style={{display: 'flex', justifyContent: 'space-between'}} >
                  <Autoevaluation
                  handleChangeCursor={x=>this.handleChangeCursor('connaissance', text_connaissance, x)}
                  handleChangeText={x=>this.handleChangeText('connaissance',text_connaissance, x, this.state.connaissance)}
                  label={'Connaissance de soi : '}
                  obj={this.state.connaissance}
                  />
                  <Autoevaluation
                  handleChangeCursor={x=>this.handleChangeCursor('formations', text_formations, x)}
                  handleChangeText={x=>this.handleChangeText('formations', text_formations, x, this.state.formations)}
                  label={'Formations et métiers : '}
                  obj={this.state.formations}
                  />
                  <Autoevaluation
                  handleChangeCursor={x=>this.handleChangeCursor('techniques', text_techniques, x)}
                  handleChangeText={x=>this.handleChangeText('techniques', text_techniques, x, this.state.techniques)}
                  label={`Techniques de recherche d'emploi : `}
                  obj={this.state.techniques}
                  />





              </div>
              <input
                onClick = {this.onValideChangements}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Valider les changements"
              />
          </div>
        </article>)
      }
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Changer le mot de passe</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Ancien mot de passe</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password1"
                id="password1"
                onChange={this.onPreviousPasswordChange}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Nouveau mot de passe</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password2"
                id="password2"
                onChange={this.onNewPassword1Change}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Confirmer le nouveau mot de passe</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password3"
                id="password3"
                onChange={this.onNewPassword2Change}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick = {this.onSubmitChange}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Confirmer"
            />
          </div>
          {this.state.errorLogin===true ?
          <div className="lh-copy mt3">
            <p className="f6 link dim black db pointer">Erreur : les mots de passe saisis ne sont pas identiques</p>
          </div>
          : null }
        </div>
      </main>
    </article>

    </div>

      )
}
}

export default Profile;
