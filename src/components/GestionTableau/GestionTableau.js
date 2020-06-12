import React, { Component } from 'react';
import { connect } from 'react-redux';
import XLSX from 'xlsx';
import Table from '../Table/Table';
import Panneau from '../Panneau/Panneau';
import DisplayListFiles from '../DisplayListFiles/DisplayListFiles';
import Synthese from '../Synthese/Synthese';
import { Progress } from 'reactstrap';


import { setSearchFieldUsersFile, setSearchFieldUsersDatabase, setSearchFieldUsersPP} from '../../actions';


const mapStateToProps = state => {
  return {
    // cochelisteUsers: state.sortUsers.cochelisteUsers,
    searchfieldUsersFile: state.sortUsersFile.searchfieldUsersFile,
    searchfieldUsersDatabase: state.sortUsersData.searchfieldUsersDatabase,
    searchfieldUsersPP: state.sortUsersPP.searchfieldUsersPP,
    cochelisteDocs: state.listeDocs.cochelisteDocs,
    // searchfieldDocs: state.sortDocs.searchfieldDocs
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchUsersFile: (event) => dispatch(setSearchFieldUsersFile(event.target.value)),
    onSearchUsersDatabase: (event) => dispatch(setSearchFieldUsersDatabase(event.target.value)),
    onSearchUsersPP: (event) => dispatch(setSearchFieldUsersPP(event.target.value)),
  }
};



class GestionTableau extends Component {
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
          infoAutoeval:{},
          infoComm:'Écrire un commentaire',
          infoComments:[],
          infoPartages:[],
          boolSynth:false,
          listFiles:[]
        };
      }

      componentDidUpdate(props) {
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

      fileHandler = (event) => {

      let fileObj = event.target.files[0];
      console.log(fileObj);
      var reader = new FileReader();

      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data,{type: 'array'});
        console.log(workbook);
        console.log(workbook.Sheets.Worksheet);
        var newrows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.Worksheet,{header:this.props.properties});
        console.log(newrows);
            this.setState({
              rows: newrows,
              cocheList: newrows.reduce(
                (total, ligne) => ({
                  ...total,
                  [Object.values(ligne)[this.props.idx]] : false
                }),
                {}),
              toggleList: newrows.reduce(
                (total, ligne) => ({
                  ...total,
                  [Object.values(ligne)[this.props.idx]] : false
                }),
                {})
            });
          };

      reader.readAsArrayBuffer(fileObj,this.setState);
      //just pass the fileObj as parameter
      // ExcelRenderer(fileObj, (err, resp) => {
      //   if(err){
      //     console.log(err);
      //   }
      //   else{
      //   }
      // });
    };

      loadDatabase = () => {
        console.log(this.props.user.admin);
        fetch('http://localhost:3000',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            admin:this.props.user.admin,
          })
        })
        .then(response => response.json())
        .then (base => {
          console.log(base);
          // const base2=base.map(elt => ({Prénom: elt.prénom, Nom: elt.nom, Classe: elt.classe, Mail: elt.mail, InitialPassword: elt.initpw }));
          const base2=base.map(elt => ({Prénom: elt.prénom, Nom: elt.nom, Classe: elt.classe, Mail: elt.mail, InitialPassword: elt.initpw, admin: elt.admin, resp: elt.resp, autoeval: elt.autoeval}));
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

      loadDatabasePP = () => {
        console.log(this.props.user.resp);
        fetch('http://localhost:3000/resp',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            resp:this.props.user.resp,
          })
        })
        .then(response => response.json())
        .then (base => {
          console.log(base);
          // const base2=base.map(elt => ({Prénom: elt.prénom, Nom: elt.nom, Classe: elt.classe, Mail: elt.mail, InitialPassword: elt.initpw }));
          const base2=base.map(elt => ({Prénom: elt.prénom, Nom: elt.nom, Classe: elt.classe, Mail: elt.mail, autoeval: elt.autoeval }));
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


      transfertFichiers = async () => {
        console.log('Transfert de fichiers');
        // console.log(this.props.cocheListFiles);
        console.log(this.props.cochelisteDocs);
        console.log(this.state.cocheList);
        const docs = Object.keys(this.props.cochelisteDocs).filter(elt => this.props.cochelisteDocs[elt]);
        console.log(docs);
        const students = Object.keys(this.state.cocheList).filter(elt => this.state.cocheList[elt]);
        console.log(students);

        const answer = await Promise.all(students.map( async student => {
          const answer2 = await Promise.all(docs.map( async doc => {

              const response = await fetch('http://localhost:3000/copy_folder',{
                  method: 'post',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    doc:doc,
                    student:student,
                  })
                })
                .then(x => x.json())
                .then(x => {if (x.status==='c') {

              // console.log(response);

                // const response2 = await
                fetch('http://localhost:3000/copy_file',{
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      auteur: this.props.user.prénom+' '+this.props.user.nom,
                      doc:doc,
                      student:student,
                    })
                  })
                // .then(x => x.json())
              }
              return x; })

              console.log(response);
              return response;



          }))
          this.setState(prevState => ({ barnow: prevState.barnow+1 }));
          return answer2;
        }))
        this.setState({barnow: 0});
        console.log(answer);
      alert(this.message2(answer));

      }

      loadDatabaseComments = async () => {
        console.log(this.props.user, this.state.infoLink);
        const answer = await fetch('http://localhost:3000/displaycomments2',{
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
        console.log(answer);
        // if (Array.isArray(answer)) {
          this.setState({infoComments: answer.commentaires,infoPartages:answer.partages});
        // }
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

        var line = this.state.rows.filter(elt => {return (elt.Mail===name)})[0];
        var title=line.Prénom + ' ' + line.Nom;
        if (line.Classe==='Prof'){bool=false}
        console.log(name, title);
        await this.setState(prevState => ({
          toggleList: {
            ...prevState.toggleList,
            [name]: !prevState.toggleList[name]
          },
          infoBool:bool,
          infoLink:name,
          infoAutoeval:line.autoeval,
          infoTitle:title,
          boolSynth:false
        })
      );
        console.log(this.state.toggleList,this.state.infoBool,this.state.infoLink,this.state.infoTitle);
        if (bool) {this.loadDatabaseComments()}
        // console.log(this.state.toggleList);
      }



      Profil = user => {
        return (
          user.Prénom+' '+user.Nom+'\n'
          +'Connaissance de soi: '+ user.autoeval.connaissance.value+'%\n'+ user.autoeval.connaissance.text+'\n\n'
          +'Formations et métiers: '+ user.autoeval.formations.value+'%\n'+ user.autoeval.formations.text+'\n\n'
          +`Techniques de recherche d'emploi: `+ user.autoeval.techniques.value+'%\n'+ user.autoeval.techniques.text+'\n\n'
        )
      }

      handleAfficheProfil = name => {
         const user=this.state.rows.filter(elt => {return (elt.Mail===name)})[0];
         console.log(user);
         alert(this.Profil(user));
      }



      deleteLines = () => {

        this.setState(prevState => ({
          rows: prevState.rows.filter(el => !this.state.cocheList[el.Mail])
        })
      );

      }


      modifClasse = (str) => {
        this.setState(prevState => ({
          rows: this.state.rows.map(elt => {
              if (this.state.cocheList[elt.Mail]) {
                elt.Classe=str;
              }
              return(elt)
            })
        }))
      }

      askClasse = () => {
        var str = prompt("Nouvelle classe :");
        if (str != null && str !== "") {
          this.modifClasse(str);
        }
      }

      modifClasseDatabase = async (str) => {
        this.modifClasse(str);
        let liste = this.filtrage2(this.state.rows);
        const answer = await Promise.all(liste.map( async elt => {
          const response = await fetch('http://localhost:3000/updateclass',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              admin:this.props.user.admin,
              classe:str,
              mail:elt.Mail,
            })
          })
          .then(x => x.json())
          return response;
        })
      );
      alert(this.message(answer));
      }


      askClasseDatabase = () => {
        var str = prompt("Nouvelle classe :");
        if (str != null && str !== "") {
          this.modifClasseDatabase(str);
        }
      }

      messageClasse = async (user) => {
        var str = prompt("Message :");
        if (str != null && str !== "") {
          const response = await fetch('http://localhost:3000/messageclasse',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              prénom:user.prénom,
              nom:user.nom,
              mail:user.mail,
              resp:user.resp,
              message:str
            })
        })
        .then(x => x.json());
      alert(response.message);
      }
    }


      selectAllCheckboxes = (isSelected) => {
          console.log('isSelected : ' , isSelected);

          switch (this.props.type) {
            case 'admin-file':
              var filteredUsers= this.filtrageFile(this.state.rows);
              break;
            case 'admin-data':
              var filteredUsers= this.filtrageDatabase(this.state.rows);
              break;
            case 'pp-data':
              var filteredUsers= this.filtrageDataPP(this.state.rows);
              break;
          }



          filteredUsers.forEach(elt => {
            this.setState(prevState => ({
                cocheList: {
                  ...prevState.cocheList,
                  [elt.Mail]: !isSelected
                }
              }))
          })
        };

        selectAll = () => this.selectAllCheckboxes(false);

        deselectAll = () => this.selectAllCheckboxes(true);


        manuel = (event) => {
          this.setState({
            // cols: [],
            colnames: this.props.colnames,
            properties: this.props.properties,
            rows: [{Prénom:"", Nom:"", Classe:"", Mail:"", InitialPassword:""}],
            cocheList: {Mail: false},
          });
        };

        export = () => {
        	var elt = this.filtrage2(this.state.rows);
          if (elt[0]) {
          var ws=XLSX.utils.json_to_sheet(elt,{skipHeader: 1});
          console.log(ws);
        	var wb = XLSX.utils.book_new();
        	XLSX.utils.book_append_sheet(wb,ws,"Worksheet");
        	XLSX.writeFile(wb, 'export.xlsx');
        } else {
          alert("Sélection vide");
        }
        }


        message = liste => {
          const cptd = liste.filter(x => x.status === 'd').length;
          const cptu = liste.filter(x => x.status === 'u').length;
          const cpti = liste.filter(x => x.status === 'i').length;
          const errors = liste.filter(x => x.status === 'e').map(x => x.user.mail+': '+x.message).join('\n');
          return ((cptd ? cptd===1 ? 'Un compte a été supprimé définitivement de la base\n' : (cptd+' comptes ont été supprimés définitivement de la base\n') : '')
                  +(cptu ? cptu===1 ? 'Un compte a été mis à jour\n' : (cptu+' comptes ont été mis à jour\n') : '')
                  +(cpti ? cpti===1 ? 'Un compte a été ajouté à la base\n' : (cpti+' comptes ont été ajoutés à la base\n') : '')
                  +errors || 'Sélection vide')
        }

        message2 = liste => {
          const liste2=liste.reduce((acc,curr)=> acc.concat(curr),[]);
          console.log(liste2);
          const cptu = liste2.filter(x => x.status === 'c').length;
          const errors = liste2.filter(x => x.status === 'e').map(x => x.file.doc + ',' + x.file.student +': un problème est survenu').join('\n');
          return ((cptu ? cptu===1 ? 'Un fichier a été copié\n' : (cptu+' fichiers ont été copiés\n') : '')
                  +errors || 'Sélection vide')
        }

        exportDatabase = async () => {
        	let liste = this.filtrage2(this.state.rows);
          const answer = await Promise.all(liste.map( async elt => {
          const response = await fetch('http://localhost:3000/register',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                admin:this.props.user.admin,
                prenom:elt.Prénom,
                nom:elt.Nom,
                classe:elt.Classe,
                mail:elt.Mail,
                initPW:elt.InitialPassword,
              })
            })
            .then(x => x.json())
          this.setState(prevState => ({ barnow: prevState.barnow+1 }));
          return response;
          })
        );
        alert(this.message(answer));
        this.setState({ barnow: 0 })
        }

        color = value => {
          if (value<50) { return 'rgb(255,'+ value*5.1 +',0)'}
          else { return 'rgb(' + (255-(value-50)*5.1)  + ',255,0)' }
        }

        syntheseData = async () => {
        	let liste = this.filtrage2(this.state.rows);
          if (liste.length===0) {
            alert('Sélection vide');
          } else {
            this.setState({
              infoBool:false,
              infoLink:'',
              infoTitle:'',
              infoAutoeval:{},
              infoComm:'Écrire un commentaire',
              infoComments:[],
              infoPartages:[]
            })
          const listeConnaissance = liste.filter(x => {return !(x.autoeval.connaissance===0)})
          const moyenneConnaissance = listeConnaissance.reduce((a,b) => a+b.autoeval.connaissance.value,0)/listeConnaissance.length;
          const listeFormations = liste.filter(x => {return !(x.autoeval.formations===0)})
          const moyenneFormations = listeFormations.reduce((a,b) => a+b.autoeval.formations.value,0)/listeFormations.length;
          const listeTechniques = liste.filter(x => {return !(x.autoeval.techniques===0)})
          const moyenneTechniques = listeTechniques.reduce((a,b) => a+b.autoeval.techniques.value,0)/listeTechniques.length;
          this.setState({
            infoTitle:'Moyenne de la sélection',
            infoAutoeval: {
                  "connaissance": {
                            "value": moyenneConnaissance,
                            "text": "",
                            "color": this.color(moyenneConnaissance)
                            },
                    "formations": {
                            "value": moyenneFormations,
                            "text": "",
                            "color": this.color(moyenneFormations)
                            },
                    "techniques": {
                            "value": moyenneTechniques,
                            "text": "",
                            "color": this.color(moyenneTechniques)
                            }
                        },
            boolSynth: true
          })

          const response = await fetch('http://localhost:3000/synthesefiles',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                list:this.state.cocheList,
              })
            })
            .then(x => x.json())
            .then(x => this.setState({listFiles:x.response}));
        }

        }

        deleteData = async () => {
        	let liste = this.filtrage2(this.state.rows);
          const answer = await Promise.all(liste.map( async elt => {
          const response = await fetch('http://localhost:3000/delete_user',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                admin:this.props.user.admin,
                mail:elt.Mail,
              })
            })
            .then(x => x.json())
          this.setState(prevState => ({ barnow: prevState.barnow+1 }));
          return response;
          })
        );
          // x => console.log("finished")
          console.log('finished');
          console.log(answer);
          this.loadDatabase();
          alert(this.message(answer));
          this.setState({ barnow: 0 })
        }

        suppressData = async function() {
          const deletion = await this.deleteData();
          this.loadDatabase();
        }


        normalise = (str) => {
          return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        filtrageFile = (liste) => {
          console.log('filtrageFile');
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Mail] ||
            this.normalise(elt.Prénom).includes(this.normalise(this.props.searchfieldUsersFile)) ||
            this.normalise(elt.Nom).includes(this.normalise(this.props.searchfieldUsersFile)) ||
            this.normalise(elt.Classe).includes(this.normalise(this.props.searchfieldUsersFile)) ||
            this.normalise(elt.Mail).includes(this.normalise(this.props.searchfieldUsersFile)) )
        });
      }

        filtrageDatabase = (liste) => {
          console.log('filtrageDatabase');
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Mail] ||
            this.normalise(elt.Prénom).includes(this.normalise(this.props.searchfieldUsersDatabase)) ||
            this.normalise(elt.Nom).includes(this.normalise(this.props.searchfieldUsersDatabase)) ||
            this.normalise(elt.Classe).includes(this.normalise(this.props.searchfieldUsersDatabase)) ||
            this.normalise(elt.Mail).includes(this.normalise(this.props.searchfieldUsersDatabase)) )
        });
      }

        filtrageDataPP = (liste) => {
          console.log('filtrageDataPP');
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Mail] ||
            this.normalise(elt.Prénom).includes(this.normalise(this.props.searchfieldUsersPP)) ||
            this.normalise(elt.Nom).includes(this.normalise(this.props.searchfieldUsersPP)) ||
            this.normalise(elt.Classe).includes(this.normalise(this.props.searchfieldUsersPP)) ||
            this.normalise(elt.Mail).includes(this.normalise(this.props.searchfieldUsersPP)) )
        });
      }

      filtrage = {
                    'admin-file': this.filtrageFile,
                    'pp-data': this.filtrageDataPP,
                    'admin-data': this.filtrageDatabase,
                  }[this.props.type]

// Lorsque 'admin-data' c'est toujours l'option correspondante à 'pp-data' qui est appelée

      // filtrage = (this.props.type==='admin-file') ? this.filtrageFile : ((this.props.type==='admin-data') ? this.filtrageDatabase : ((this.props.type==='pp-data') ? this.filtrageDataPP : null));






      filtrage2 = (liste) => {
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Mail])
        });
      }

        changeAdmin = async (liste,bool) => {
          console.log(liste);
          const choice = window.confirm('Voulez-vous mettre à jour la base de données ?')
          if (choice) {
            const response = await fetch('http://localhost:3000/updateadminuser',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  admin:this.props.user.admin,
                  prénom:liste.Prénom,
                  nom:liste.Nom,
                  classe:liste.Classe,
                  mail:liste.Mail,
                  initPW:liste.InitialPassword,
                  resp: liste.resp,
                  adminuser:!bool,
                  autoeval:liste.autoeval,
                })
              })
              .then(x => x.json());

              this.loadDatabase();
              alert(response.message);
              if (response.status==='u' && response.user.mail === this.props.user.mail)
                   { this.props.loadUser(response.user);
                     console.log(this.props.user);
                    }

              console.log(this.state.rows);
            }
          }

        changeResp = async (liste,x) => {
          console.log(liste);
          const message = `Voulez-vous attribuer des classes à ce professeur ?\n
          Donner la liste des classes séparées par des virgules\n
          Exemple : Terminale1A,Terminale1B,2ndeD`;
          const prevResp = Object.keys(liste.resp).join(', ');

          var str= prompt(message,prevResp);
          console.log(str, typeof(str));
          if (str===null){return;}
          if (str==="") {
            str=[]
          } else {
          str=str.split(",").map(x=>x.trim());
        }

          const obj=str.reduce(
              (total, elt) => ({
                ...total,
                [elt] : true
              }),
              {});
            const response = await fetch('http://localhost:3000/updateuser',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                admin:this.props.user.admin,
                prénom:liste.Prénom,
                nom:liste.Nom,
                classe:liste.Classe,
                mail:liste.Mail,
                initPW:liste.InitialPassword,
                adminuser:liste.admin,
                resp:obj,
                autoeval:liste.autoeval,
              })
            })
            .then(x => x.json());

            this.loadDatabase();
            alert(response.message);
            if (response.status==='u' && response.user.mail === this.props.user.mail)
                 { this.props.loadUser(response.user);
                   console.log(this.props.user);
                  }
              }





        changeCell = (i,j,k) => {

          switch (this.props.type) {
            case 'admin-file':
              var filteredUsers= this.filtrageFile(this.state.rows);
              break;
            case 'admin-data':
              var filteredUsers= this.filtrageDatabase(this.state.rows);
              break;
            case 'pp-data':
              var filteredUsers= this.filtrageDataPP(this.state.rows);
              break;
          }

          console.log(filteredUsers[i][this.props.properties[j]],k);
          filteredUsers[i][this.props.properties[j]] = k;
          this.forceUpdate();
          console.log(filteredUsers[i][this.props.properties[j]],k);
        };

        changeCellDatabase = (i,j,k) => {

          switch (this.props.type) {
            case 'admin-file':
              var filteredUsers= this.filtrageFile(this.state.rows);
              break;
            case 'admin-data':
              var filteredUsers= this.filtrageDatabase(this.state.rows);
              break;
            case 'pp-data':
              var filteredUsers= this.filtrageDataPP(this.state.rows);
              break;
          }

          const elt = document.getElementById(`datatable`).children[1].children[i].children[j+1].textContent;
          // console.log(elt);
          // console.log(filteredUsers[i][this.state.properties[j]],k);
          if (k!==filteredUsers[i][this.props.properties[j]] && this.props.properties[j]!=="Mail") {
                const choice = window.confirm('Voulez-vous mettre à jour la base de données ?')
                if (choice) {
                filteredUsers[i][this.props.properties[j]] = k;
                this.forceUpdate();
                console.log(filteredUsers[i][this.props.properties[j]],k);

                fetch('http://localhost:3000/updateuser',{
                  method: 'post',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    admin:this.props.user.admin,
                    prénom:filteredUsers[i][this.props.properties[0]],
                    nom:filteredUsers[i][this.props.properties[1]],
                    classe:filteredUsers[i][this.props.properties[2]],
                    mail:filteredUsers[i][this.props.properties[3]],
                    initPW:filteredUsers[i][this.props.properties[4]],
                    adminuser:filteredUsers[i][this.props.properties[5]],
                    resp:filteredUsers[i][this.props.properties[6]],
                    autoeval:filteredUsers[i][this.props.properties[7]],
                  })
                })
                .then(response => response.json())
                .then(response => {alert(response.message);
                                      return response})
                                      .then(response => {
                                        console.log(response);
                                        console.log(this.props.user);
                                        if (response.status==='u' && response.user.mail === this.props.user.mail)
                                       { this.props.loadUser(response.user);
                                         console.log(this.props.user);
                                        }})



              } else {
                document.getElementById(`datatable`).children[1].children[i].children[j+1].textContent=filteredUsers[i][this.props.properties[j]];
                // console.log(elt);
        }
      } else {
        document.getElementById(`datatable`).children[1].children[i].children[j+1].textContent=filteredUsers[i][this.props.properties[j]];
        // console.log(elt);
}
        };



      render() {

        console.log(this.state.infoComments);
        switch (this.props.type) {
          case 'admin-file':
            var filteredUsers= this.filtrageFile(this.state.rows);
            var bool=filteredUsers.length === 0 && this.props.searchfieldUsersFile.length===0;
            var onSearchChange = this.props.onSearchUsersFile;
            var handleChange = this.changeCell;
            var quelleClasse = this.askClasse;
            var handleClickLine=this.handleToggleLine;
            var contentEditable = true;
            var classname = 'filetable';
            break;
          case 'admin-data':
            var filteredUsers= this.filtrageDatabase(this.state.rows);
            var bool=filteredUsers.length === 0 && this.props.searchfieldUsersDatabase.length===0;
            var onSearchChange = this.props.onSearchUsersDatabase;
            var handleChange = this.changeCellDatabase;
            var quelleClasse = this.askClasseDatabase;
            var handleClickLine=this.handleToggleLine;
            var handleChangeAdmin = this.ChangeAdmin;
            var contentEditable = true;
            var classname = 'datatable';
            break;
          case 'pp-data':
            var filteredUsers= this.filtrageDataPP(this.state.rows);
            var bool=filteredUsers.length === 0 && this.props.searchfieldUsersPP.length===0;
            var onSearchChange = this.props.onSearchUsersPP;
            var handleClickLine=this.handleToggleLine;
            var contentEditable = false;
            var classname = 'elevespp';
            break;
        }
        const bool2= this.state.properties !== this.props.properties;



      return(
        <div>
        {this.props.type==='admin-file' ?
          <div>
            <p class='f3 b'> Importation des élèves et professeurs : </p>
            <input type="file"
           id="liste" name="liste"
           accept=".xlsx,.xls,.ods,.csv" onChange={this.fileHandler.bind(this)}
            className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib" />
            <input type="submit"
            onClick={this.reduire}
            value="Réduire"
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" />
            <input type="submit"
            onClick={this.manuel}
            value="Saisie manuelle"
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" />
        </div>
        : null }

        {this.props.type==='admin-data' ?
          <div>
            <p class='f3 b'> Gestion de la base des utilisateurs : </p>
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

        {this.props.type==='pp-data' ?
          <div>
            <p class='f3 b'> Vos élèves : </p>
              <input type="submit"
              onClick={this.loadDatabasePP}
              value="Afficher / Rafraîchir"
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" />
              <input type="submit"
              onClick={this.reduire}
              value="Réduire"
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" />

        </div>
        : null }

      {(bool || bool2) ? null : (
        <div>
        <Panneau type={this.props.type}
                selectAll={this.selectAll}
                deselectAll={this.deselectAll}
                deleteLines={this.deleteLines}
                deleteData={this.deleteData}
                askClasse={quelleClasse}
                export={this.export}
                exportDatabase={this.exportDatabase}
                onSearchChange={onSearchChange}
                syntheseData={this.syntheseData}
                messageClasse={x => this.messageClasse(this.props.user)}
                transfertFichiers={x => this.transfertFichiers()}
                />
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
        handleChange={handleChange}
        handleChangeAdmin={this.changeAdmin}
        handleCheckboxChange={this.handleCheckboxChange}
        handleToggleLine={handleClickLine}
        handleChangeResp={this.changeResp}
        contentEditable={contentEditable}
        classname={classname}
        type={this.props.type}
        />
      {this.state.infoBool && this.props.type!=='admin-file' ?

        <DisplayListFiles
          title={this.state.infoTitle}
          autoeval={this.state.infoAutoeval}
          type={this.props.type}
          user={this.props.user}
          handleAddComment={this.handleAddComment}
          handleKeyPress={x => this.handleKeyPress(x,this.props.user,this.state.infoLink)}
          commentaires={this.state.infoComments}
          partages={this.state.infoPartages}
          loadDatabase={this.loadDatabaseComments}
           />

        : null}
        {this.state.boolSynth ?
          <Synthese
            title={this.state.infoTitle}
            autoeval={this.state.infoAutoeval}
            listFiles={this.state.listFiles}
            />

        : null}
        </div>
      </div>
    )}
        <br />

        </div>

      )}
}

export default connect(mapStateToProps, mapDispatchToProps)(GestionTableau);
