import React, { Component } from 'react';



class Option extends Component {
      constructor(props){
        super(props);
      }


      render() {
      var { route, bool, str, onRouteChange } =this.props;


      return(
        <p onClick={() => onRouteChange(route)} className={bool ? 'f3 link dim white mt0 mv0 pa3 pointer bg-black' : 'f3 link dim black mt0 mv0 pa3 pointer' }> {str} </p>
      );
    }
}


export default Option;
