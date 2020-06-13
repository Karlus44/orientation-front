import React from 'react';

class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      errorLogin: false,
    }
  }


  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.onSubmitSignIn()
    }
  }

  sendPassword = async () => {
    var mail= prompt('Veuillez entrer votre adresse mail');
    if (mail===null){return; }
    const response = await fetch('https://git.heroku.com/orientation-back.git/requestpassword',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          mail:mail
        })
      })
      .then(x => x.json());
    alert(response.message);
  }

  onSubmitSignIn = () => {
    console.log(this.state);
    fetch('https://git.heroku.com/orientation-back.git/signin',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email:this.state.signInEmail.toLowerCase(),
        password:this.state.signInPassword,
      })
    })
    .then(response => response.json())
    .then (user => {
      console.log(user);
      if (user.id) {
        this.props.loadUser(user);
        this.setState({errorLogin: false});
        this.props.onRouteChange('home');
      } else {
        this.setState({errorLogin: true});
      }
    })

  }



  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input onChange={this.onEmailChange}
                  onKeyPress = {this.handleKeyPress}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email" name="email-address"  id="email-address"/>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input onChange={this.onPasswordChange}
                  onKeyPress = {this.handleKeyPress}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
              </div>
            </fieldset>
            <div className="">
              <input
                onClick = {this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            {this.state.errorLogin===true ?
            <div className="lh-copy mt3">
              <p className="f6 link dim black db pointer">Erreur d'authentification</p>
            </div>
            : null }
            <div>
              <p onClick={this.sendPassword} className="f6 link dim black db pointer">Mot de passe perdu ?</p>
            </div>
          </div>
        </main>
      </article>
    );

  }

}

export default SignIn;
