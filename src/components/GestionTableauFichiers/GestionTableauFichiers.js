import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '../Table/Table';
import Panneau from '../Panneau/Panneau';
import DisplayInfoFile from '../DisplayInfoFile/DisplayInfoFile';
import { Progress } from 'reactstrap';


// import { setSearchFieldUsers, setCocheListeUsers, setSearchFieldDocs, setCocheListeDocs } from '../../actions';
import { setSearchFieldDocs, setCocheListeDocs} from '../../actions';


const mapStateToProps = state => {
  return {
    searchfieldDocs: state.sortDocs.searchfieldDocs
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchDocs: (event) => dispatch(setSearchFieldDocs(event.target.value)),
    onCocheDocs: (event) => dispatch(setCocheListeDocs(event))
  }
};



class GestionTableauFichiers extends Component {
      constructor(props){
        super(props);
        this.state = {
          colnames: this.props.colnames,
          properties: this.props.properties,
          rows: [],
          cocheList: {},
          toggleList: {},
          barnow:0,
          infoBool:false,
          infoLink:'',
          infoTitle:'',
          infoComm:'Écrire un commentaire',
          infoComments:[]
        };
      }

      componentDidMount(props) {
        if (this.props.type==='files-eleve') {
          this.loadDatabase2();
        }
      }

      componentDidUpdate(props) {
          if (this.props.type === 'files-prof') {
            this.props.onCocheDocs(this.state.cocheList);
          }

          if (this.state.properties !== this.props.properties) {
            this.reduire();
          }
        }

      componentWillUnmount() {
            this.reduire();
        }


      reduire = (event) => {
        const response = this.setState({
          // cols: [],
          colnames: this.props.colnames,
          properties: this.props.properties,
          rows: [],
          cocheList: {},
          toggleList: {},
        });
      };


      loadDatabase = () => {
        fetch('https://git.heroku.com/orientation-back.git/displayfiles',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            type:this.props.type,
          })
        })
        .then(response => response.json())
        .then (base => {
          console.log(base);
          const base2=base.map(elt => ({Auteur: elt.auteur, Nom: elt.nom, Description: elt.description, Average:elt.average, Notes: elt.notes,  Mail:elt.mail, Lien: elt.lien}));
          console.log(base2);
          this.setState({
            rows:base2,
            cocheList: base2.reduce(
              (total, ligne) => ({
                ...total,
                [Object.values(ligne)[this.props.idx]] : false
              }),
              {}),
            toggleList: base2.reduce(
              (total, ligne) => ({
                ...total,
                [Object.values(ligne)[this.props.idx]] : false
              }),
              {})
          })
        })
        .catch(answer => alert(this.message([answer])))
      };

      loadDatabase2 = () => {
        fetch('https://git.heroku.com/orientation-back.git/displayfileseleve',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            type:this.props.type,
            eleve:this.props.user
          })
        })
        .then(response => response.json())
        .then (base => {
          console.log(base);
          const base2=base.map(elt => ({Auteur: elt.auteur_partage, Nom: elt.nom, Description: elt.description, Average:elt.average, Notes: elt.notes,  Mail:elt.mail, Lien: elt.lien_eleve}));
          console.log(base2);
          this.setState({
            rows:base2,
            cocheList: base2.reduce(
              (total, ligne) => ({
                ...total,
                [Object.values(ligne)[this.props.idx]] : false
              }),
              {}),
            toggleList: base2.reduce(
              (total, ligne) => ({
                ...total,
                [Object.values(ligne)[this.props.idx]] : false
              }),
              {})
          })
        })
        .catch(answer => alert(this.message([answer])))
      };

      loadDatabaseComments = async () => {
        const answer = await fetch('https://git.heroku.com/orientation-back.git/displaycomments',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user:this.props.user,
            link:this.state.infoLink
          })
        })
        .then(response => response.json());
        // .then(response => {response.json();
        // console.log(response)})
        // .then(response => this.setState({infoComments: response}))
        // console.log(answer);
        if (Array.isArray(answer)) {
          this.setState({infoComments: answer});
        }
      };


      handleCheckboxChange = changeEvent => {
        const {name} = changeEvent.target;

        this.setState(prevState => ({
          cocheList: {
            ...prevState.cocheList,
            [name]: !prevState.cocheList[name]
          }
        }))
        console.log(this.state.cocheList);
      }

      handleToggleLine = async (name) => {
        var bool=true;
        console.log(name, this.state.toggleList[name])
        if (this.state.toggleList[name]) {bool=false}

        var title = this.state.rows.filter(elt => {return (elt.Lien===name)})[0].Nom;
        await this.setState(prevState => ({
          toggleList: {
            ...prevState.toggleList,
            [name]: !prevState.toggleList[name]
          },
          infoBool:bool,
          infoLink:name,
          infoTitle:title
        }))

        if (bool) {this.loadDatabaseComments()}
        console.log(this.state.toggleList);

      }


      deleteLines = () => {

        this.setState(prevState => ({
          rows: prevState.rows.filter(el => !this.state.cocheList[el.Lien])
        })
      );

      }



      modifClasseDatabase = async (str) => {
        this.modifClasse(str);
        let liste = this.filtrage2(this.state.rows);
        const answer = await Promise.all(liste.map( async elt => {
          const response = await fetch('https://git.heroku.com/orientation-back.git/updatenamefile',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              user:this.props.user.mail,
              nom:str,
              lien:elt.Lien,
            })
          })
          .then(x => x.json())
          return response;
        })
      );
      alert(this.message(answer));
      }




      selectAllCheckboxes = (isSelected) => {
          console.log('isSelected : ' , isSelected);
          var filteredUsers= this.filtrage(this.state.rows);
          filteredUsers.forEach(elt => {
            this.setState(prevState => ({
                cocheList: {
                  ...prevState.cocheList,
                  [elt.Lien]: !isSelected
                }
              }))
          })
        };

        selectAll = () => this.selectAllCheckboxes(false);

        deselectAll = () => this.selectAllCheckboxes(true);



        message = liste => {
          const cptd = liste.filter(x => x.status === 'd').length;
          const cptu = liste.filter(x => x.status === 'u').length;
          const cpti = liste.filter(x => x.status === 'i').length;
          const errors = liste.filter(x => x.status === 'e').map(x => x.file.nom+': '+x.message).join('\n');
          return ((cptd ? cptd===1 ? 'Un fichier a été supprimé définitivement de la base\n' : (cptd+' fichiers ont été supprimés définitivement de la base\n') : '')
                  +(cptu ? cptu===1 ? 'Un fichier a été mis à jour\n' : (cptu+' fichiers ont été mis à jour\n') : '')
                  +(cpti ? cpti===1 ? 'Un fichier a été ajouté à la base\n' : (cpti+' fichiers ont été ajoutés à la base\n') : '')
                  +errors || 'Sélection vide')
        }




        noteFile = async (lien, notes, rating) => {
          notes[`${this.props.user.mail}`]=rating;
          console.log(this.props.user.mail, lien, rating);
          console.log(notes);
          var sum = 0;
          var array=Object.values(notes);
          var length = array.length;
          var avg = 0;
          if (length !==0){
          for( var i = 0; i < array.length; i++ ){
                sum += array[i];
            }
            avg = sum/length;
          }

          const response = await fetch('https://git.heroku.com/orientation-back.git/notefile',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              mail:this.props.user.mail,
              lien:lien,
              notes:notes,
              avg:avg
            })
          })
          .then(x => x.json())
          .then(x => console.log(x))
          .then(this.setState(prevState => ({
            rows: prevState.rows.map(elt => {
                if (elt.Lien===lien) {
                  elt.Notes=notes;
                  elt.Average=avg;
                }
                return(elt)
              })
          })
        )
        );
        }


        deleteData = async () => {
        	let liste = this.filtrage2(this.state.rows);
          const answer = await Promise.all(liste.map( async elt => {
          const response = await fetch('https://git.heroku.com/orientation-back.git/delete_file',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                user:this.props.user,
                lien:elt.Lien,
                nom:elt.Nom,
              })
            })
            .then(x => x.json())
            .then(x => {if (x.status==='d') {
              fetch('https://git.heroku.com/orientation-back.git/delete_folder',{
                  method: 'post',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    user:this.props.user,
                    lien:elt.Lien,
                    nom:elt.Nom,
                  })
            });
            this.setState(prevState => ({ barnow: prevState.barnow+1 }));
          }
          return x;
        })
          return response;
          })
        );
          console.log('finished');
          this.setState({barnow: 0});
          console.log(answer);
          this.loadDatabase();
          alert(this.message(answer));
        }

        suppressData = async function() {
          const deletion = await this.deleteData();
          this.loadDatabase();
        }


        normalise = (str) => {
          return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        filtrage = (liste) => {
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Lien] ||
            this.normalise(elt.Auteur).includes(this.normalise(this.props.searchfieldDocs)) ||
            this.normalise(elt.Nom).includes(this.normalise(this.props.searchfieldDocs)) ||
            this.normalise(elt.Description).includes(this.normalise(this.props.searchfieldDocs)) ||
            this.normalise(elt.Lien).includes(this.normalise(this.props.searchfieldDocs)) )
        });
      }



      filtrage2 = (liste) => {
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Lien])
        });
      }


        changeCell = (i,j,k) => {

          var filteredUsers= this.filtrage(this.state.rows);
          console.log(filteredUsers[i][this.props.properties[j]],k);
          filteredUsers[i][this.props.properties[j]] = k;
          this.forceUpdate();
          console.log(filteredUsers[i][this.props.properties[j]],k);
        };

        changeCellDataFile = (i,j,k) => {

          var filteredUsers= this.filtrage(this.state.rows);
          console.log(filteredUsers[i]);
          console.log(this.props.properties[j]);
          console.log(filteredUsers[i][this.props.properties[j]]);

          const elt = document.getElementById(`listfiletable`).children[1].children[i].children[j+1].textContent;
          console.log(elt);
          console.log(filteredUsers[i][this.props.properties[j]],k);
          if (k!==filteredUsers[i][this.props.properties[j]]) {
          const choice = window.confirm('Voulez-vous mettre à jour la base de données ?')
          if (choice) {
                filteredUsers[i][this.props.properties[j]] = k;
                this.forceUpdate();
                console.log(filteredUsers[i][this.props.properties[j]],k);

                fetch('https://git.heroku.com/orientation-back.git/updatefile',{
                  method: 'post',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    user:this.props.user,
                    auteur:filteredUsers[i][this.props.properties[0]],
                    mail:filteredUsers[i][this.props.properties[4]],
                    lien:filteredUsers[i][this.props.properties[5]],
                    nom:filteredUsers[i][this.props.properties[1]],
                    description:filteredUsers[i][this.props.properties[2]],
                    notes:filteredUsers[i][this.props.properties[3]],
                  })
                })
                .then(response => response.json())
                .then(response => {
                                      alert(response.message);
                                      return response})
                                      .then(response => {
                                        console.log(response);
                                        console.log(this.props.user);
                                      })
                                    }
                else {
           document.getElementById(`listfiletable`).children[1].children[i].children[j+1].textContent=filteredUsers[i][this.props.properties[j]];
                                      // console.log(elt);
                                    }
                                  }
                else {
           document.getElementById(`listfiletable`).children[1].children[i].children[j+1].textContent=filteredUsers[i][this.props.properties[j]];
                                      // console.log(elt);
                                    }
                                  }

                                    ;



      render() {

        var filteredUsers= this.filtrage(this.state.rows);
        var bool=filteredUsers.length === 0 && this.props.searchfieldDocs.length===0;
        var onSearchChange = this.props.onSearchDocs;
        const bool2= this.state.properties !== this.props.properties;



      return(
        <div>
        {this.props.type==='files-prof' || this.props.type==='files-admin' ?
          <div>
              <p class='f3 b'> Fichiers : </p>
              <input type="submit"
              onClick={this.loadDatabase}
              value="Afficher / Rafraîchir"
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" />
              <input type="submit"
              onClick={this.reduire}
              value="Réduire"
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" />

        </div>
        : null }


      {((bool || bool2) && (this.props.type==='files-prof' || this.props.type==='files-admin')) ? null : (
        <div>
          {/*  {(this.props.type==='files-eleve') ? <br/> : null} */}
          {(this.props.type==='files-prof' || this.props.type==='files-eleve' || this.props.type==='files-admin') ?
        <Panneau type={this.props.type}
                selectAll={this.selectAll}
                deselectAll={this.deselectAll}
                deleteLines={this.deleteLines}
                deleteData={this.deleteData}
                askClasse={this.askClasse}
                export={this.export}
                onSearchChange={onSearchChange}
                syntheseData={this.syntheseData}
                messageClasse={x => this.messageClasse(this.props.user)}
                />
              : null }

        {(this.state.barnow === 0 || this.state.barnow === this.filtrage2(this.state.rows).length) ? null :
          <div >
              <link
                rel='stylesheet'
                href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css'
                />
              <Progress animated striped color="success" value={this.state.barnow} max={this.filtrage2(this.state.rows).length} >
                {`${this.state.barnow}/${this.filtrage2(this.state.rows).length}`}
              </Progress>
          </div>
          }

          <div style={{display: 'flex', justifyContent: 'space-between'}} >
            <Table Liste={filteredUsers}
            colnames={this.props.colnames}
            idx = {this.props.idx}
            cocheList={this.state.cocheList}
            toggleList={this.state.toggleList}
            handleChange={this.changeCellDataFile}
            handleCheckboxChange={this.handleCheckboxChange}
            handleToggleLine={this.handleToggleLine}
            handleChangeResp={this.changeResp}
            contentEditable={false}
            classname={'listfiletable'}
            type={this.props.type}
            user={this.props.user}
            noteFile={this.noteFile}
            />
          {this.state.infoBool ?
          <DisplayInfoFile
            title={this.state.infoTitle}
            type={this.props.type}
            link={this.state.infoLink}
            user={this.props.user}



            commentaires={this.state.infoComments}
            loadDatabase={this.loadDatabaseComments}
             />
          : null}
        </div>
      </div>
    )}
        <br />

        </div>

      )}
}

export default connect(mapStateToProps, mapDispatchToProps)(GestionTableauFichiers);
