import React, { Component } from 'react';
import { connect } from 'react-redux';
import XLSX from 'xlsx';
import './Administration.css';
import Table from '../Table/Table';
import Panneau from '../Panneau/Panneau';


// import { setSearchFieldUsers, setCocheListeUsers, setSearchFieldDocs, setCocheListeDocs } from '../../actions';
import { setSearchFieldUsers } from '../../actions';

const adminState = {
  colnames: ["Prénom", "Nom", "Classe", "Mail"],
  rows: [],
  cocheList: {}
}

const mapStateToProps = state => {
  return {
    // cochelisteUsers: state.sortUsers.cochelisteUsers,
    searchfieldUsers: state.sortUsers.searchfieldUsers,
    // cochelisteDocs: state.sortDocs.cochelisteDocs,
    // searchfieldDocs: state.sortDocs.searchfieldDocs
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchUsers: (event) => dispatch(setSearchFieldUsers(event.target.value)),
    // onCocheUsers: (event,l) => dispatch(setCocheListeUsers(event,l)),
    // onCocheUsers: (event) => console.log(event),
    // onSearchDocs: (event) => dispatch(setSearchFieldDocs(event.target.value)),
    // onCocheDocs: (event) => dispatch(setCocheListeDocs(event))
  }
};



class Administration extends Component {
      constructor(){
        super();
        this.state = adminState;
      }

      reduire = (event) => {
        this.setState({
          // cols: [],
          colnames: ["Prénom", "Nom", "Classe", "Mail"],
          rows: [],
          cocheList: {},
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
        var newrows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.Worksheet,{header:this.state.colnames});
        console.log(newrows);
            this.setState({
              rows: newrows,
              cocheList: newrows.reduce(
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
      }


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
        if (str != null || str !== "") {
          this.modifClasse(str);
        }
      }

      selectAllCheckboxes = (isSelected) => {
          console.log('isSelected : ' , isSelected);

          this.filtrage(this.state.rows).forEach(elt => {
            this.setState(prevState => ({
                cocheList: {
                  ...prevState.cocheList,
                  [elt.Mail]: !isSelected
                }
              }))
          })

          // Object.keys(this.state.cocheList).forEach(name => {

          // this.setState(prevState => ({
          //     cocheList: {
          //       ...prevState.cocheList,
          //       [name]: !isSelected
          //     }
          //   }))
          //
          // });
        };

        selectAll = () => this.selectAllCheckboxes(false);

        deselectAll = () => this.selectAllCheckboxes(true);


        manuel = (event) => {
          this.setState({
            // cols: [],
            colnames: ["Prénom", "Nom", "Classe", "Mail"],
            rows: [{Prénom:"", Nom:"", Classe:"", Mail:""}],
            cocheList: {Mail: false},
          });
        }

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


        normalise = (str) => {
          return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        filtrage = (liste) => {
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Mail] ||
            this.normalise(elt.Prénom).includes(this.normalise(this.props.searchfieldUsers)) ||
            this.normalise(elt.Nom).includes(this.normalise(this.props.searchfieldUsers)) ||
            this.normalise(elt.Classe).includes(this.normalise(this.props.searchfieldUsers)) ||
            this.normalise(elt.Mail).includes(this.normalise(this.props.searchfieldUsers)) )
        });
      }

        filtrage2 = (liste) => {
          return liste.filter(elt => {
            return (this.state.cocheList[elt.Mail])
        });
      }

        changeCell = (i,j,k) => {
          console.log(this.state.rows[i][this.state.colnames[j]],k);
          this.state.rows[i][this.state.colnames[j]] = k;
          this.forceUpdate();
          console.log(this.state.rows[i][this.state.colnames[j]],k);
        }

      render () {
        console.log(this.state.rows);
        const filteredUsers=this.filtrage(this.state.rows);
        console.log(filteredUsers);




      return(
        <div>
        <h1> Importation des élèves et professeurs :
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
        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" /> <br />

      {(filteredUsers.length === 0 && this.props.searchfieldUsers.length===0) ? <a> Aucun fichier </a> : (
        <div>
        <Panneau selectAll={this.selectAll}
                deselectAll={this.deselectAll}
                deleteLines={this.deleteLines}
                askClasse={this.askClasse}
                export={this.export}
                onSearchChange={this.props.onSearchUsers}/>

        <Table Liste={filteredUsers}
        colnames={this.state.colnames}
        idx = {this.props.idx}
        cocheList={this.state.cocheList}
        handleChange={this.changeCell}
        handleCheckboxChange={this.handleCheckboxChange}
        />
      </div>
    )}
        <br />


        Alimenter la base des élèves <br />
        Alimenter la base des profs <br />
        Affecter à chaque classe des élèves et un professeur principal </h1>
        </div>

      )}
}

export default connect(mapStateToProps, mapDispatchToProps)(Administration);
