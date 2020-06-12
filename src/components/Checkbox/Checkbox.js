import React, { Component } from 'react';



class Checkbox extends Component {
      constructor(props){
        super(props);
      }
      render() {

      const { value, label, isSelected, onCheckboxChange } =this.props;
      // console.log(label);
      // console.log(isSelected);


      return(
        <div>
        {value}
          <input
            type="checkbox"
            name={label}
            checked={isSelected}
            onChange={onCheckboxChange}
          />
        </div>
        );
      }
    }



export default Checkbox;
