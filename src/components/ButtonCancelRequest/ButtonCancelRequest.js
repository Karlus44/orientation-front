import React, { Component } from 'react';
import '../Table/Table.css';


class ButtonCancelRequest extends Component {
      constructor(props){
        super(props);
      }




        cancel = async (mail) => {
            const response = await fetch('https://git.heroku.com/orientation-back.git/cancelrequest',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  admin:this.props.user.admin,
                  mail:mail
                })
              })
              .then(x => x.json());
              console.log(response);
              this.props.refresh();
            }



        cancelRequest = async function(mail) {
          const action = await this.cancel(mail);
          this.props.refresh();
        }

render() {
      return (
        <input
          onClick = {x=> this.cancelRequest(this.props.mail) }
          className="bg-light-red br4 f6 link dim black pa0 ph2 mt0 mv0 b--black"
          type="submit"
          value={this.props.text}
        />
    );
  }
}




export default ButtonCancelRequest;
