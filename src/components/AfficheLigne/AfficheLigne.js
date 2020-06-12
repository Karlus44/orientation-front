import React, { Component } from 'react';
import '../Table/Table.css';



class AfficheLigne extends Component {



      render() {
      const {liste, onclick} = this.props;
      console.log(liste);
      const str='Professeur référent de: '+liste.join(', ')
      return(
      <p onClick={onclick} contentEditable={false} className="bg-light-green br4 f6 link dim black pa0 ph2 mt0 mv0 b--black">{str}</p>
      );
    }
}




export default AfficheLigne;
