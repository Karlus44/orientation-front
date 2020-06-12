import React, { Component } from 'react';
import DisplayInfoFile from '../DisplayInfoFile/DisplayInfoFile';
import SuperCellAutoeval from '../SuperCellAutoeval/SuperCellAutoeval';
import '../Table/Table.css';

class DisplayListFiles extends Component {
  constructor(props){
    super(props);
  }


  componentDidMount() {
    this.props.loadDatabase();
  }



      render() {
      var { title, user, commentaires } =this.props;


      return(
        <div id='displaylistcomments'>
            <div class='tl f5 b' className= 'styleList_resp' > {this.props.title}: </div>
            <SuperCellAutoeval
              content={this.props.autoeval}
              contentEditable={false}
            />
          {this.props.partages.map((x,idx) => {
            // var title='';
            // var link='';
            // if (x[0]) {
            //   title=x[0].nom_fichier;
            //   link=x[0].lien_fichier;
            // };
            return(
            <DisplayInfoFile
              link={x.lien_eleve}
              title={x.nom}
              type={this.props.type}
              user={this.props.user}
              commentaires={commentaires[idx]}
              loadDatabase={this.props.loadDatabase}
               />
          )})}


      </div>

        );
    }
}


export default DisplayListFiles;
