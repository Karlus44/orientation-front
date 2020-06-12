import React, { Component } from 'react';
import '../Table/Table.css';
import * as moment from 'moment';
import 'moment/locale/fr';



class DisplayComment extends Component {
      constructor(props){
        super(props);
      }




      handleDeleteComment= async (event) => {
        if (event.key === 'Enter') {
          console.log('delete', this.props.key, this.props.cellIndex);
          //   const response = await fetch('http://localhost:3000/addcomment',{
          //     method: 'post',
          //     headers: {'Content-Type': 'application/json'},
          //     body: JSON.stringify({
          //       user:user,
          //       lien:link,
          //       comment:this.state.infoComm
          //     })
          //   })
          //   .then(x => x.json())
          // console.log(response);
          // await this.loadDatabaseComments();
          // await this.setState({infoComm:'Écrire un commentaire'})

        }
      }


      render() {
      var { content} =this.props;

      const cellMarkup =
          <div className="Cell" id={this.props.key} contentEditable={this.props.contentEditable} suppressContentEditableWarning={true}
            onBlur={(e)=>{this.props.handleChange(e.currentTarget.textContent)}}>
          {this.props.content} {this.props.contentEditable ?
                                    <input
                                      onClick = {this.props.handleDelete}
                                      className="tr bg-light-red br4 f7 link dim black pa0 ph2 mt0 mv0 b--black"
                                      type="submit"
                                      value={'Effacer'}
                                    />
                                  : null}
        </div>


      return(
        <div className={this.props.contentEditable ? 'styleList_prof' : 'styleList'}>
          <div class='tl f6 b' > {this.props.author}: </div>
          {cellMarkup}
          <div class='tl f7' > {moment.parseZone(this.props.date).calendar()}</div>
        </div>
      );
    }
}


export default DisplayComment;
