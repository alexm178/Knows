import React, { Component } from 'react';
import axios from 'axios'
import Navbar from './navbar';
import PostSection from './PostSection';
import ProfileHeader from './ProfileHeader';



class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      profile: null,
      loading: true
    }
  }

  componentWillMount() {
    axios.get('/user/profile/' + this.props.profileId).then(
      response => {
        this.setState({
          profile: response.data.profile,
          loading: false
        })
      }
    ).catch(
      err => {
        console.log(err);
        alert('Someting went wrong :(')
      }
    )
  }

  render() {
    if (this.state.loading) {
      return (<div className="spinner"><div className="dot1"></div><div className="dot2"></div></div>)
    } else {
      return (
        <div className ="Profile with-top-navbar">
          <div className="growl" id="app-growl"></div>
          <Navbar user={this.props.user} updateUser={this.props.updateUser}/>
          <ProfileHeader profile={this.state.profile} updateUser={this.props.updateUser.bind(this)}/>
          <div className="container pt-4">
            <div className="row">
              <div className="col-md-4">

              </div>
              <div className="col-md-8">
                < PostSection user={this.props.user} profile={true} profileId={this.props.profileId} emit={this.props.emit.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Profile;
