import React, { Component } from 'react';
import SearchBox from '../SearchBox/SearchBox';

class Panneau extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
    <div>
        <SearchBox searchChange = {this.props.onSearchChange}/>
        {this.props.type!=='files-eleve' ?
        <input
          onClick = {this.props.selectAll}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Sélectionner tous"
        />
      : null }
      {this.props.type!=='files-eleve' ?
        <input
          onClick = {this.props.deselectAll}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Déselectionner tous"
        />
      : null }
      {this.props.type==='admin-file' ?
        <input
          onClick = {this.props.deleteLines}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Supprimer la sélection"
        />
        : null }
        {this.props.type==='admin-file' || this.props.type==='admin-data' ?
        <input
          onClick = {this.props.askClasse}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Modifier la classe de la sélection"
        />
        : null }
        {this.props.type !=='files-prof' && this.props.type !=='files-admin' && this.props.type!=='files-eleve' ?
        <input
          onClick = {this.props.export}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Exporter la sélection dans un fichier"
        />
        : null }
        {this.props.type==='admin-file' ?
        <input
          onClick = {this.props.exportDatabase}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Exporter la sélection dans la base"
        />
    : null }
    {this.props.type==='admin-data' || this.props.type==='files-prof' || this.props.type==='files-admin' ?
    <input
      onClick = {this.props.deleteData}
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      type="submit"
      value="Supprimer la sélection"
    />
    : null }
    {this.props.type==='pp-data' ?
    <input
      onClick = {this.props.syntheseData}
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      type="submit"
      value="Synthèse de la sélection"
    />
    : null }
    {this.props.type==='pp-data' ?
    <input
      onClick = {this.props.messageClasse}
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      type="submit"
      value="Envoyer un message à tous vos élèves"
    />
    : null }
    {this.props.type==='pp-data' ?
    <input
      onClick = {this.props.transfertFichiers}
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      type="submit"
      value="Envoyer les fichiers sélectionnés aux élèves sélectionnés"
    />
    : null }
  </div>
  )
      }
}

export default Panneau;
