import React, { Component } from 'react';

class SearchBox extends Component {
// const SearchBox = ({searchfield, searchChange}) => {
componentWillUnmount() {
      const fakeEvent={target:{value:''}};
      this.props.searchChange(fakeEvent);
  }

render() {
  const {searchfield, searchChange}=this.props;
  return(
    <div className='pa2'>
    <input
      // className='pa3 ba b--green bg-lightest-blue'
      className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
      type='search'
      placeholder='Recherche'
      onChange= {searchChange}
    />
    </div>
  );
  }
}
export default SearchBox;
