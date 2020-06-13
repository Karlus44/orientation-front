import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import * as moment from 'moment';
import 'moment/locale/fr';
import '../Table/Table.css';


class Notifications extends Component {
      constructor(props){
        super(props);
        this.state = {
          colnames: ['Notifications','date','index'],
          liste:[],
          idx:2,
        };
      }

      componentDidMount(){
        this.loadDatabase();
      }


      loadDatabase = () => {
        fetch('https://git.heroku.com/orientation-back.git/displaynotifications',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            mail:this.props.user.mail,
            resp:this.props.user.resp,
            classe:this.props.user.classe,
          })
        })
        .then(response => response.json())
        .then (base => {
          console.log(base);

          const base2=base.map(elt => ({Notifications: elt.contenu, Date: moment.parseZone(elt.created_at).calendar(), index: elt.id_comment}));
          console.log(base2);
          this.setState({
            liste:base2,
          })
        });

      }

      // handleCancelRequest = (mail) => {
      //         this.setState(prevState => ({
      //           liste: prevState.liste.filter(el => !(el.Utilisateur===mail))
      //         })
      //       );
      //       }


      renderHeadingRow = (_cell, cellIndex) => {
        if (cellIndex<this.state.idx) {


        return (

          <Cell
            key={`heading-${cellIndex}`}
            content={this.state.colnames[cellIndex]}
            header={true}
          />

          )
        }
      };


      renderRow = (_row, rowIndex) => {
        const {liste, idx, colnames} = this.state;
        const index = Object.values(liste[rowIndex])[idx];
        const longueur = colnames.length-1;
        console.log(longueur);

        // console.log(bool4);

        return (
            <tr key={`row-${index}`} className={"styleList"}
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
        </tr>
      );

      const tbodyMarkup = liste.map(this.renderRow);

      return (
        <div>
        <table className='Table' >
          <thead>{theadMarkup}</thead>
          <tbody>{tbodyMarkup}</tbody>
        </table>
        </div>
    );
  }

}


export default Notifications;
