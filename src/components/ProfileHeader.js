import React, { Component } from 'react';
import AvatarForm from './avatar-form';
import axios from 'axios'


class ProfileHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  follow() {
    axios.put('/user/follow?id=' + this.props.profile._id).then(
      response => {
        console.log(response)
      }
    )
  }

  render() {
    return (
      <div className="profile-header" style={{backgroundImage: 'url(' + this.props.profile.cover + ')'}}>
        <div className="container">
          <div className="container-inner">
            <div className="rounded-circle media-object profile-avatar" style={{backgroundSize: 'cover', backgroundPosition: 'top center', backgroundImage: 'url(' + this.props.profile.img + ')'}}></div>
            <AvatarForm user={this.props.profile} updateUser={this.props.updateUser.bind(this)} />
            <h3 className="profile-header-user">{this.props.profile.firstName + ' ' + this.props.profile.lastName}</h3>
            <p className="profile-header-bio">
            {this.props.profile.bio}
            </p>
          </div>
          <button onClick={this.follow.bind(this)}>Follow</button>
        </div>

        <nav className="profile-header-nav">
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item active">
              <a className="nav-link collection" id="feed" href="#">Feed</a>
            </li>
            <li className="nav-item">
              <a className="nav-link collection" id="projects" href="#">Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link collection" id="photos" href="#">Photos</a>
            </li>
          </ul>
        </nav>
      </div>

    );
  }
}

export default ProfileHeader;
