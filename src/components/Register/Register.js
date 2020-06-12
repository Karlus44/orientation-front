import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerPrénom: '',
      registerNom: '',
      registerEmail: '',
      registerInitialPassword: '',
      registerInitialPassword2: '',
      errorLogin: false
    }
  }


  onPrénomChange = (event) => {
    this.setState({registerPrénom: event.target.value})
  }

  onNomChange = (event) => {
    this.setState({registerNom: event.target.value})
  }


  onEmailChange = (event) => {
    this.setState({registerEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({registerInitialPassword: event.target.value})
  }

  onPasswordChange2 = (event) => {
    this.setState({registerInitialPassword2: event.target.value})
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.onSubmitregister()
    }
  }






  onSubmitregister = () => {
    console.log(this.state);
    if (this.state.registerInitialPassword===this.state.registerInitialPassword2) {
    this.setState({errorLogin: false});
    fetch('http://localhost:3000/firstuser',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prénom:this.state.registerPrénom,
          nom:this.state.registerNom,
          mail:this.state.registerEmail.toLowerCase(),
          initPW:this.state.registerInitialPassword,
        })
      })
      .then(response => response.json())
      .then (user => {
        console.log(user);
        if (user.mail) {
          this.props.loadUser(user);
          this.props.setVide(false);
          this.props.onRouteChange('home');
        }
      })
    } else {
        this.setState({errorLogin: true});
    }

  }


  render () {
    const { onRouteChange } = this.props;
    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Inscription</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="prenom">Prénom</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="prenom"
                id="prenom"
                onChange={this.onPrénomChange}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">Nom</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                id="name"
                onChange={this.onNomChange}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={this.onEmailChange}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Mot de passe</label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={this.onPasswordChange}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Confirmer le mot de passe</label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={this.onPasswordChange2}
                onKeyPress = {this.handleKeyPress}
                />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick = {this.onSubmitregister}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Register"
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
  );
  }
}

export default Register;
