import React, { Component } from 'react';
import SuperIndicator from '../SuperIndicator/SuperIndicator';
import '../Table/Table.css';



class SuperCellAutoeval extends Component {
      constructor(props){
        super(props);
      }


      render() {
      var { content, contentEditable } =this.props;
      var cellMarkup = null;
      if (Object.values(content).length===3) {
      var cellMarkup = (
          <div className= 'styleList' contentEditable={this.props.contentEditable}>
                < SuperIndicator content={Object.values(content)[0]} label ={'Connaissance de soi'} />
                < SuperIndicator content={Object.values(content)[1]} label = {'Formations et métiers'}/>
                < SuperIndicator content={Object.values(content)[2]} label = {`Techniques de recherche d'emploi`} />
          </div>
        );
        }

      return(cellMarkup);
    }
}


export default SuperCellAutoeval;
