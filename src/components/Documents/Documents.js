import React, {Component} from 'react';
import axios from 'axios';

class Documents extends Component {
      constructor(props){
        super(props);
        this.state = {
          title : '',
          file : null,
          desc : 'Description de votre fichier',
          size : 0,
        };
      }


      fileHandler = (event) => {

      if (this.state.file.size < 101) {


      const formData = new FormData();
      formData.append('title', this.state.title);
      formData.append('desc', this.state.desc);
      formData.append('mail', this.props.user.mail);
      formData.append('author', this.props.user.prénom+' '+this.props.user.nom);
      formData.append('file', this.state.file);
      axios({
          method: "POST",
          url:"https://orientation-back.herokuapp.com/upload",
          headers: {'Content-Type': 'multipart/form-data'},
          data: formData,
      })
      .then((response) => {
          alert(`Le fichier a bien été envoyé`);
          this.setState({
            title : '',
            file : null,
            desc : 'Description de votre fichier'
          })
          }).catch((error) => {
          console.log(error);
          })

        } else {
          alert('Ceci est une version de test. Merci de bien vouloir proposer des fichiers de taille inférieure à 100 octets');
        }


      }


      render() {
        console.log(this.state);
      return(
        <div>
            {this.props.user.classe === 'Prof' ?
              <div>
                <br />
                <form  className="b ph3 pv2 input-reset w-100 w-50-m w-25-l ba b--black bg-transparent pointer f6 dib" >
                  <p> Proposer un fichier :</p>
                 <label className="db fw6 lh-copy w-90 w-40-m w-20-l f6">
                 <input type="text" value={this.state.title}
                 onChange={(e) => this.setState({title: e.target.value})}
                 placeholder="Nom du fichier"/>
                 </label>
                 <br />
                 <label>
                 <input type="file" name="fichier"
                   onChange={(e) => this.setState({file: e.target.files[0],
                                                  title: e.target.files[0].name,
                                                  desc: 'Description de votre fichier',
                                                  size: e.target.files[0].size
                                                })} />
                 </label>
                 <br />
                 <label>
                 <textarea value={this.state.desc}
                   rows="8" cols="40"
                   onChange={(e) => this.setState({desc: e.target.value})} >
                 </textarea>
                 </label>
                 <br />
                 <input type="button" value="Valider" onClick={this.fileHandler} />
                 </form>
          </div>
          : null }
        </div>
      )
    }
}

export default Documents;
