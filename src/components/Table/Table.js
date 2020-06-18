import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import CellAutoeval from '../CellAutoeval/CellAutoeval';
import Checkbox from '../Checkbox/Checkbox';
import AfficheLigne from '../AfficheLigne/AfficheLigne';
import Rater from 'react-rater'
import './Table.css';
const path = require('path');
// import '../../../node_modules/react-rater/lib/react-rater.css'


class Table extends Component {
      // constructor(props){
      //   super(props)
      // }


      renderHeadingRow = (_cell, cellIndex) => {
        const {colnames} = this.props;

        return (
          <Cell
            key={`heading-${cellIndex}`}
            content={colnames[cellIndex]}
            header={true}
          />
        )
      };


      renderRow = (_row, rowIndex) => {
        const {Liste, idx, colnames} = this.props;
        const mail = Object.values(Liste[rowIndex])[idx];
        console.log(path.join(Liste[rowIndex].Lien, Liste[rowIndex].Nom).replace("https:/c", "https://c"));
        console.log(path.isAbsolute(path.join(Liste[rowIndex].Lien, Liste[rowIndex].Nom).replace("https:/c", "https://c")));
        // console.log(idx);
        // console.log(Object.values(Liste[rowIndex]));
        // console.log(mail);
        const bool = this.props.cocheList[`${mail}`];
        const bool2 = Liste[rowIndex].admin;
        const bool3 = this.props.toggleList[`${mail}`];
        var bool4 = false;
        if (this.props.type==='admin-data') {
          if ('resp' in Liste[rowIndex]) {
            // console.log(Liste[rowIndex]);
            if (Object.keys(Liste[rowIndex].resp).length) {
              // console.log(Object.keys(Liste[rowIndex].resp).length);
              bool4=true;
              // console.log(bool4);
            }
          }
        }
        // const bool4 = this.props.type==='admin-data' && Liste[rowIndex].resp!=='undefined' && Object.keys(Liste[rowIndex].resp).length;
        const bool5 = Liste[rowIndex].Classe==='Prof';
        const bool6 = this.props.type === 'files-prof' && Liste[rowIndex].Mail === this.props.user.mail;
        const bool7 = this.props.type==='files-prof' || this.props.type==='files-admin' || this.props.type==='admin-data' || this.props.type==='pp-data' || this.props.type==='files-eleve';
        const longueur = colnames.length;

        return (
            <tr key={`row-${mail}`} className={bool ? "styleList_selected" : bool2 ? "styleList_admin" :
              bool4 ? "styleList_resp" : bool5 ? "styleList_prof" : bool6 ? "styleList_admin" :  "styleList"}
              >
              {bool7 ?
                <Cell
                  key={`${this.props.classname}-${rowIndex}-plusminus`}
                  onClick = {x => this.props.handleToggleLine(mail)}
                  content={bool3 ?
                    <img src="icons8-plus-24.png" alt=''/>  :
                    <img src="icons8-minus-24.png" alt=''/>
                  }
                  contentEditable={false}
                />
              : null}
              { Object.values(Liste[rowIndex]).map((_cell, cellIndex) => {
                if (cellIndex<longueur) {
                  if (colnames[cellIndex] === "Notes") {
                    return(
                      <td>
                          <Rater total={5} rating={Liste[rowIndex].Average} interactive={false} />
                      </td>
                      );
                  } else {
                return(



                    <Cell
                      key={`${this.props.classname}-${rowIndex}-${cellIndex}`}
                      onClick = {x => {if (!bool7) {this.props.handleToggleLine(mail)}}}
                      content={Object.values(Liste[rowIndex])[cellIndex]}
                      handleChange={x => this.props.handleChange(rowIndex,cellIndex,x)}
                      contentEditable={(bool6 || this.props.type==='files-admin') && colnames[cellIndex] === "Description" ? true : this.props.contentEditable}
                    />


                  );
              }
            }
          }
          )}

            {this.props.type==='pp-data' ?
            <CellAutoeval
              content={Liste[rowIndex].autoeval}
              contentEditable={false}
            />
          : null}
              {this.props.type==='files-prof' || this.props.type==='files-admin' || this.props.type==='files-eleve' ?
                <td>
                    <a href = {path.join(Liste[rowIndex].Lien, Liste[rowIndex].Nom)}  download
                      className="bg-light-green br4 f6 link dim black pa0 ph2 mt0 mv0 b--black">Ouvrir</a>
                  </td>
            : null}

              {this.props.type!=='files-eleve' ?
                <td><Checkbox
                    label={Object.values(Liste[rowIndex])[idx]}
                    isSelected={bool}
                    onCheckboxChange={this.props.handleCheckboxChange}
                />
                </td>
                : null}


                {bool3 && bool5 && this.props.type==='admin-data' ?
                <td><Checkbox
                    value={'administrateur'}
                    label={Object.values(Liste[rowIndex])[idx]+'admin'}
                    isSelected={bool2}
                    onCheckboxChange={x=>this.props.handleChangeAdmin(Liste[rowIndex],bool2)}
                /></td>
                :null}
                  {bool3 && bool5 && this.props.type==='admin-data' ?
                  <td><AfficheLigne
                      liste={Object.keys(Liste[rowIndex].resp)}
                      onclick={x=>this.props.handleChangeResp(Liste[rowIndex],x)}
                  /></td>
                :null}
                {bool3 && (this.props.type==='files-prof' || this.props.type==='files-admin') ?
                  <div>
                    <a>Votre note:</a>
                    <Rater total={5}
                      rating={Liste[rowIndex].Notes[`${this.props.user.mail}`]
                      ?  Liste[rowIndex].Notes[`${this.props.user.mail}`]
                      : 0}
                      onRate={({rating}) => this.props.noteFile(
                                            Liste[rowIndex].Lien,
                                            Liste[rowIndex].Notes,
                                            rating)}
                          />
                  </div>
                : null}

              </tr>
        );
        };








      render() {

      const { Liste, colnames} =this.props;
      const bool7 = this.props.type==='files-prof' || this.props.type==='files-admin' || this.props.type==='admin-data' || this.props.type==='pp-data' || this.props.type==='files-eleve';



      this.renderHeadingRow = this.renderHeadingRow.bind(this);
      this.renderRow = this.renderRow.bind(this);

      const theadMarkup = (
        <tr key="heading">
          {bool7 ?
            <Cell
              key={`heading-plusminus`}
              content={''}
              header={true}
              />
            : null
            }
          {colnames.map(this.renderHeadingRow)}
          {this.props.type==='pp-data' ?
          <Cell
            key={`heading-autoevaluation`}
            content={'Autoévaluation'}
            header={true}
          />
        : null}
        </tr>
      );

      const tbodyMarkup = Liste.map(this.renderRow);

      return (
        <table className='Table' id={this.props.classname} >
          <thead>{theadMarkup}</thead>
          <tbody>{tbodyMarkup}</tbody>
        </table>
    );
  }

}


export default Table;
