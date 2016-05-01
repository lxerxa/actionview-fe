import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Issues from './Issues';

const img = require('../assets/images/shanghai.jpg');

class Home extends Component {

  render() {
    return (
      <div>
        <div className='container-fluid main-box'>
          <div className='row'>
            <Sidebar indexImg={ img } />
            <div className='col-sm-7 col-sm-offset-3 main-content'>
              <Issues />
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Home;
