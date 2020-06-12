import React, { Component } from 'react';
import '../Table/Table.css';



class Cell extends Component {
      constructor(props){
        super(props);
      }


      render() {
      var { content, header, handleChange } =this.props;
      const cellMarkup = header ? (
          <th className="Cell Cell-header">
          {content}
          </th>
        ) : (
          <td className="Cell v-top" id={this.props.key} contentEditable={this.props.contentEditable} suppressContentEditableWarning={true}
            onBlur={(e)=>{handleChange(e.currentTarget.textContent)}} onClick={this.props.onClick}>
          {content}
          </td>
        );

      return(cellMarkup);
    }
}


export default Cell;
