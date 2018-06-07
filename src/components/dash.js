import React, { Component } from 'react';
import axios from 'axios'
import {Route, Link} from 'react-router-dom'
import Navbar from './navbar'
import ProfileCard from './profile-card'


class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className ="Dash with-top-navbar">
        <div className="growl" id="app-growl"></div>
        <Navbar user={this.props.user} updateUser={this.props.updateUser}/>
        <div className="container pt-4">
          <div className="row">
            <div className="col-lg-3">
              < ProfileCard user={this.props.user} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dash;
