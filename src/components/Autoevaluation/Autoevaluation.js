import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
import '../Table/Table.css';




class Autoevaluation extends Component {
      constructor(props){
        super(props);

      }

      render() {
      var { obj, label } =this.props;


      return(
        <div>
        <p>{label}</p>
        <Gauge value={this.props.obj.value} width={150} height={120} valueFormatter={value => `${value}%`} label={''} color={this.props.obj.color} />
        <input type="range" min="0" max="100" value={this.props.obj.value} onChange={x => this.props.handleChangeCursor(x)} />
        <textarea
        onChange={x => this.props.handleChangeText(x, obj)}
        value={this.props.obj.text}
        rows="5"
            />
      </div>

        );
    }
}


export default Autoevaluation;
