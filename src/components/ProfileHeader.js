import React, { Component } from 'react';
import AvatarForm from './avatar-form';
import FollowButton from './FollowButton'


class ProfileHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }


  render() {
    return (
      <div className="profile-header" style={{backgroundImage: 'url(' + this.props.profile.cover + ')'}}>
        <div className="container">
          <div className="edit-cover">
            Cover <span className="icon icon-camera"></span>
          </div>
          <div className="container-inner">

              <div className="rounded-circle media-object profile-avatar" style={{backgroundSize: 'cover', backgroundPosition: 'top center', backgroundImage: 'url(' + this.props.profile.img + ')'}}>
              {this.props.profile._id === this.props.user._id &&
                <div className="edit-avatar">
                  <span className="icon icon-camera"></span>
                </div>
              }


            </div>
            <h3 className="profile-header-user">{this.props.profile.firstName + ' ' + this.props.profile.lastName}</h3>
            <p className="profile-header-bio">
            {this.props.profile.bio}
            </p>
          </div>
          <FollowButton isProfile={true} user={this.props.user} id={this.props.profile._id} isFollowing={this.props.user.following.some(follow => {return follow === this.props.profile._id})} emit={this.props.emit.bind(this)}/>

        </div>



        <nav className="profile-header-nav">
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item active">
              <a className="nav-link collection" id="feed" href="feed">Feed</a>
            </li>
            <li className="nav-item">
              <a className="nav-link collection" id="projects" href="projects">Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link collection" id="photos" href="photos">Photos</a>
            </li>
          </ul>
        </nav>
      </div>

    );
  }
}

export default ProfileHeader;
