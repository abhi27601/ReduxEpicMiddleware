import React from 'react';

import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import Beers from './components/Beers';
class App extends React.Component {
  render (){

    console.log(this.props.name);
    return (
      <div className="App">
        <Beers />

      </div>
    );
  }
  
}

export default connect(state => state.app)(App);
