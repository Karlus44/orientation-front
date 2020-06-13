import React, { Component } from 'react';
import DisplayComment from '../DisplayComment/DisplayComment';
import '../Table/Table.css';

class DisplayInfoFile extends Component {
  constructor(props){
    super(props);
    this.state = {
      infoComm:'Écrire un commentaire',
      bool:false
    }
  }


  componentDidMount() {
    this.props.loadDatabase();
  }

  changeBool=()=> {
    this.setState({bool: !this.state.bool})
  }

  handleAddComment = (e) => {
    this.setState({infoComm:e.target.value});
    console.log(e.target.value);

  }

  handleKeyPress = async (event) => {
  // handleKeyPress = async (event, user, link) => {
    if (event.key === 'Enter') {
      console.log('Submit', this.props.user.mail, this.props.link);
        const response = await fetch('https://git.heroku.com/orientation-back.git/addcomment',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user:this.props.user,
            lien:this.props.link,
            type:this.props.type,
            comment:this.state.infoComm
          })
        })
        .then(x => x.json())
      console.log(response);
      await this.props.loadDatabase();
      await this.setState({infoComm:'Écrire un commentaire'})

    }
  }

  handleChange =(y,idxComment,cellIndex) => {
    // console.log(y,cellIndex);
    // console.log(document.getElementById(`displaycomments`).children[cellIndex].children[1].textContent);
    fetch('https://git.heroku.com/orientation-back.git/updatecomment',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          idx:idxComment,
          content:y,
        })
      })
      .then(x => x.json())
      .then(x =>console.log(x))
      .then(x => this.props.loadDatabase());
  }

  handleDelete =(idxComment) => {
    console.log(idxComment);
    // console.log(document.getElementById(`displaycomments`).children[cellIndex].children[1].textContent);
    fetch('https://git.heroku.com/orientation-back.git/deletecomment',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          idx:idxComment,
        })
      })
      .then(x => x.json())
      .then(x =>console.log(x))
      .then(x => this.props.loadDatabase());
  }


      render() {
      var { user, commentaires } =this.props;

      return(
        <div id='displaycomments'>

            <div className= 'styleList_admin' style={{display: 'flex', justifyContent: 'flex-start'}}>
                {this.state.bool ?
                    <img src="icons8-plus-24.png" onClick={this.changeBool} alt=''/> :
                    <img src="icons8-minus-24.png" onClick={this.changeBool} alt=''/>
                  }
                  <div class='tl f5 b' className= 'Cell' > {this.props.title}: </div>
            </div>

          {this.state.bool ?
            <div>
              {this.props.commentaires.map((x,cellIndex) => {return(
                <DisplayComment
                  content={x.contenu}
                  contentEditable={x.mail===user.mail || this.props.user.admin}
                  key={x.id_comment}
                  author={x.prénom+' '+x.nom}
                  date={x.created_at}
                  cellIndex={cellIndex}
                  handleChange={y=>this.handleChange(y,x.id_comment,cellIndex)}
                  handleDelete={y=>this.handleDelete(x.id_comment)}
                  />
              )})
            }
            <textarea
            className='textarea'
            onChange={this.handleAddComment}
            onKeyPress={x=> {this.handleKeyPress(x)}}
            value={this.state.infoComm}
                />
            </div>
        : null}

      </div>

    );
    }
}


export default DisplayInfoFile;
