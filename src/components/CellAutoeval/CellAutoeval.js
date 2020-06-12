import React, { Component } from 'react';
import Indicator from '../Indicator/Indicator';
import '../Table/Table.css';



class CellAutoeval extends Component {
      constructor(props){
        super(props);
      }


      render() {
      var { content, contentEditable } =this.props;
      const cellMarkup = (

          <td className="Cell v-top" id={this.props.key} contentEditable={this.props.contentEditable}>
              <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                < Indicator content={Object.values(content)[0]} label ={'Connaissance de soi'} />
              < Indicator content={Object.values(content)[1]} label = {'Formations et métiers'}/>
            < Indicator content={Object.values(content)[2]} label = {`Techniques de recherche d'emploi`} />
              </div>
          </td>
        );

      return(cellMarkup);
    }
}


export default CellAutoeval;
