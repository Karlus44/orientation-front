import React, { Component } from 'react';
import SuperCellAutoeval from '../SuperCellAutoeval/SuperCellAutoeval';
import '../Table/Table.css';



class Synthese extends Component {
      constructor(props){
        super(props);
      }


      render() {


      return(

        <div>
          <div class='tl f5 b' className= 'styleList_resp' > {this.props.title}: </div>
          <SuperCellAutoeval
            content={this.props.autoeval}
            contentEditable={false}
          />
        <div class='tl f5 b' className= 'styleList_resp' > Fichiers les plus transmis: </div>
        <div className= 'styleList'>
        {this.props.listFiles.map((x)=> { return(
          <div className='Cell'>
            {x[0]} : {x[1]} fois
          </div>

        )
        })}
      </div>
      </div>

      );
    }
}


export default Synthese;
