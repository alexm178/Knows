import React, { Component } from 'react';
import axios from 'axios'
import {Route, Link} from 'react-router-dom'
import Navbar from './navbar'
import ProfileCard from './profile-card'
import Modal from './modal'
import PostSection from './PostSection'
import Notification from './Notification'


class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className ="Dash with-top-navbar">
        <Notification userId={this.props.user._id} notifications={this.props.notifications}/>
        <Navbar user={this.props.user} updateUser={this.props.updateUser}/>
        <div className="container pt-4">
          <div className="row">
            <div className="col-md-3">
              < ProfileCard user={this.props.user} updateUser={this.props.updateUser.bind(this)} />
            </div>
            <div className="col-md-6">
              < PostSection user={this.props.user} postId={this.props.postId} profile={false} emit={this.props.emit.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dash;
