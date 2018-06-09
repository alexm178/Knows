import React, { Component } from 'react';
import axios from 'axios'
import {Route, Link} from 'react-router-dom'
import Navbar from './navbar'
import ProfileCard from './profile-card'
import Modal from './modal'
import PostSection from './PostSection'


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
              < ProfileCard user={this.props.user} updateUser={this.props.updateUser.bind(this)} />
            </div>
            <div className="col-lg-6">
                < PostSection user={this.props.user} updateUser={this.props.updateUser.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dash;
