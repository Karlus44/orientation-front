import React, { Component } from 'react';
import '../Table/Table.css';



class Indicator extends Component {
      constructor(props){
        super(props);
      }

      render() {
      var { content, label } =this.props;
      const divStyle = {
          backgroundColor: content.color,
            };
      // console.log(content);
      const text = label+': '+ content.value+'%\n'+content.text;

      {if (content.text !== '') {
        return(

            <p contentEditable={false} style={divStyle} className="br4 f6 link dim black pa0 ph2 mt0 mv0 b--black"> {content.value}% </p>
        );
      } else {return null}
    }
    }
}


export default Indicator;
