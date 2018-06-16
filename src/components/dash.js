import React, { Component } from 'react';
import Navbar from './navbar'
import ProfileCard from './profile-card'
import PostSection from './PostSection'


class Dash extends Component {

  render() {
    return (
      <div className ="Dash with-top-navbar">
        <Navbar user={this.props.user} updateUser={this.props.updateUser}/>
        <div className="container pt-4">
          <div className="row">
            <div className="col-md-3">
              < ProfileCard user={this.props.user} updateUser={this.props.updateUser.bind(this)} emit={this.props.emit.bind(this)}/>
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
