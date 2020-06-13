import React, { Component } from 'react';
import PasswordRequests from '../PasswordRequest/PasswordRequest';
import Notifications from '../Notifications/Notifications';

class Historique extends Component {
      constructor(props){
        super(props);
        this.state = {
          requests: true,
        };
      }

      componentDidMount() {
            this.testEmpty();
        }
      // componentDidUpdate() {
      //       this.testEmpty();
      //   }

      testEmpty = () => {
        console.log('testEmpty');
        fetch('https://git.heroku.com/orientation-back.git/requests',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            admin:this.props.user.admin,
          })
        })
        .then(response => response.json())
        .then(x => {
          console.log(x);
          if (x[0])  { this.setState({requests: false})} else { this.setState({requests: true})} })
      }

      render() {

        console.log(this.state.requests);
        return(
        <div>
        {
          (this.props.user.admin && !this.state.requests) ? <PasswordRequests
                                                                              user={this.props.user}
                                                                              testEmpty={this.testEmpty}/>
                                                          : null
        }
        <Notifications user={this.props.user}/>
        </div>
      );
}
}

export default Historique;
