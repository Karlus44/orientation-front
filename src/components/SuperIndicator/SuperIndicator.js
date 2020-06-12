import React, { Component } from 'react';
import '../Table/Table.css';
// import Tooltip from '../../../node_modules/@material-ui/core/Tooltip';



class SuperIndicator extends Component {
      constructor(props){
        super(props);
      }

      render() {
          const divStyle = {
              backgroundColor: this.props.content.color,
                };


        return(
          <div className='styleList'>
            <div className= 'Cell' style={{display: 'flex', justifyContent: 'flex-start'}}>
              <div class='tl f5 b' > {this.props.label}:</div>
              <p contentEditable={false} style={divStyle} className="br4 f6 link dim black pa0 ph2 mt0 mv0 b--black"> {this.props.content.value}% </p>
          </div>
          <p className= 'Cell2' > {this.props.content.text} </p>
      </div>
    //   var { content, label } =this.props;
    //   // console.log(content);
    //   const text = label+': '+ content.value+'%\n'+content.text;
    //
    //   {if (content.text !== '') {
    //     return(
    //     title={text}
    //     placement="top"
    //             >
    //             <p contentEditable={false} style={divStyle} className="br4 f6 link dim black pa0 ph2 mt0 mv0 b--black"> {content.value}% </p>
    //     );
    //   } else {return null}
    // }
  )

    }
}


export default SuperIndicator;
