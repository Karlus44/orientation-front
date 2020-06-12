import React from 'react';
import Option from '../Option/Option';
// import '../Navigation/Navigation.css';

const Navigation = ({onRouteChange, isEmpty,isSignedIn, user, Navbar}) => {
  if (!isEmpty) {
    if(isSignedIn) {
      return(
        <nav style={{display: 'flex', justifyContent: 'space-between'}} className="bg-silver pv0 ph2 mv0 b--black">
          <div style={{display: 'flex', justifyContent: 'flex-start'}}>
              <Option route={'profile'} bool={Navbar['profile']} str={'Profil'} onRouteChange={onRouteChange} className="bg-green"/>
              {user.admin===true ?
              <Option route={'gestion'} bool={Navbar['gestion']} str={'Gestion'} onRouteChange={onRouteChange}/>
              : null }
              <Option route={'home'} bool={Navbar['home']} str={'Application'} onRouteChange={onRouteChange}/>
              <Option route={'historique'} bool={Navbar['historique']} str={'Historique'} onRouteChange={onRouteChange}/>
          </div>
          <p className='f3 link white mt0 mv0 pa3 bg-black'> {user.prénom+' '+user.nom} </p>
          <Option route={'signin'} bool={Navbar['signin']} str={'Sign Out'} onRouteChange={onRouteChange}/>
        </nav>
      );
    } else {
      return(
        <nav style={{display: 'flex', justifyContent: 'flex-end'}} className="bg-silver pv0 ph2 mt0 mv0 b--black">
          <Option route={'signin'} bool={Navbar['signin']} str={'Sign In'} onRouteChange={onRouteChange}/>
        </nav>
      );

    }
  } else {
    return(
      <nav style={{display: 'flex', justifyContent: 'flex-end'}} className="bg-silver pv0 ph2 mt0 mv0 b--black">
        <Option route={'register'} bool={Navbar['register']} str={'Register'} onRouteChange={onRouteChange}/>
      </nav>
    );
  }
}

export default Navigation;
