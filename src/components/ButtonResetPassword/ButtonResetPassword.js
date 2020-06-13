import React, { Component } from 'react';
import MyEmail from '../Email/Email'
import { renderEmail } from 'react-html-email'
import axios from 'axios';
import '../Table/Table.css';


class ButtonResetPassword extends Component {
      constructor(props){
        super(props);
      }

      sendMail = elt => { if (elt.status==='u') {
        const messageHtml =  renderEmail(<MyEmail text={elt.message} />);
        console.log(messageHtml);
        axios({
            method: "POST",
            url:"http://localhost:3000/send",
            data: {
      	email: elt.user.user,
      	messageHtml: messageHtml
            }
        }).then((response)=>{
          if (response.data.status!=='u') {alert(response.data.user.mail+': '+response.data.message)}
            })
        }
      }


      message = liste => {
        const cptu = liste.filter(x => x.status === 'u').length;
        const errors = liste.filter(x => x.status === 'e').map(x => x.user.mail+': '+x.message).join('\n');
        return ((cptu ? cptu===1 ? 'Un mot de passe a été réinitialisé\n' : (cptu+' mots de passe ont été réinitialisés\n') : '')
                +errors || 'Sélection vide')
      }



      reinit = async (liste) => {
          const answer = await Promise.all(liste.map( async elt => {
          console.log(elt);
          const response = await fetch('https://git.heroku.com/orientation-back.git/resetpassword',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                admin:this.props.user.admin,
                mail:elt.Utilisateur
              })
            })
            .then(x => x.json());
            console.log(response);
            return response;
          })
        );
        console.log('finished');
        console.log(answer);
        this.props.refresh();
        alert(this.message(answer));
        answer.filter(this.sendMail);
        }




      resetPassword = async function(liste) {
        const action = await this.reinit(liste);
        this.props.refresh();
      }

      reset = async function(x){
        console.log(x);
        if (Array.isArray(x)) {
          await this.resetPassword(x);
        }
        else {
          await this.resetPassword([{Utilisateur:x}]);
        }
      }

      render() {


      return (
        <input
          onClick = {x=> this.reset(this.props.mail) }
          className="bg-light-green br4 f6 link dim black pa0 ph2 mt0 mv0 b--black"
          type="submit"
          value={this.props.text}
        />
    );
  }

}


export default ButtonResetPassword;
