import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import ButtonResetPassword from '../ButtonResetPassword/ButtonResetPassword';
import ButtonCancelRequest from '../ButtonCancelRequest/ButtonCancelRequest';
import * as moment from 'moment';
import 'moment/locale/fr';
import '../Table/Table.css';


class PasswordRequest extends Component {
      constructor(props){
        super(props);
        this.state = {
          colnames: ['Utilisateur', 'Date'],
          liste:[],
          idx:0,
        };
      }

      componentDidMount(){
        this.loadDatabase();
      }


      loadDatabase = () => {
        fetch('https://git.heroku.com/orientation-back.git/requests',{
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
          const base2=base.map(elt => ({Utilisateur: elt.user, Date: moment.parseZone(elt.created_at).calendar()}));
          console.log(base2);
          this.setState({
            liste:base2,
          })
        });
        this.props.testEmpty();
      }

      // handleCancelRequest = (mail) => {
      //         this.setState(prevState => ({
      //           liste: prevState.liste.filter(el => !(el.Utilisateur===mail))
      //         })
      //       );
      //       }


      renderHeadingRow = (_cell, cellIndex) => {

        return (
          // <tr key={`headings`} className={"styleList"}
          //   >
          <Cell
            key={`heading-${cellIndex}`}
            content={this.state.colnames[cellIndex]}
            header={true}
          />
          // </tr>
        )
      };


      renderRow = (_row, rowIndex) => {
        const {liste, idx, colnames} = this.state;
        const mail = Object.values(liste[rowIndex])[idx];
        const longueur = colnames.length;
        console.log(longueur);

        // console.log(bool4);

        return (
            <tr key={`row-${mail}`} className={"styleList"}
              >
              { Object.values(liste[rowIndex]).map((_cell, cellIndex) => {
                console.log(_cell, cellIndex, liste[rowIndex]);
                if (cellIndex<longueur) {

                return(
                    <Cell
                      key={`${rowIndex}-${cellIndex}`}
                      content={_cell}
                      contentEditable={false}
                    />
                  );
              }
            })}
                 <td><ButtonResetPassword
                     text={'Reset Password'}
                     user={this.props.user}
                     mail={mail}
                     refresh={this.loadDatabase}
                 /></td>
                 <td><ButtonCancelRequest
                     text={'Delete Request'}
                     user={this.props.user}
                     mail={mail}
                     refresh={this.loadDatabase}
                 /></td>


            </tr>

        );
      };








      render() {
      // this.loadDatabase();
      const { liste, colnames} =this.state;
      console.log(this.state);


      this.renderHeadingRow = this.renderHeadingRow.bind(this);
      this.renderRow = this.renderRow.bind(this);

      const theadMarkup = (
        <tr key="heading">
          {colnames.map(this.renderHeadingRow)}
          <td><ButtonResetPassword
            text={'Reset All'}
            user={this.props.user}
            mail={this.state.liste}
            refresh={this.loadDatabase}
            /></td>
        </tr>
      );

      const tbodyMarkup = liste.map(this.renderRow);

      return (
        <div>
        <p class='tl f5 b'>Demandes de réinitialisation de mot de passe :</p>
        <table className='Table' >
          <thead>{theadMarkup}</thead>
          <tbody>{tbodyMarkup}</tbody>
        </table>
        </div>
    );
  }

}


export default PasswordRequest;
