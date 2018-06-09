import React, { Component } from 'react';
import AvatarForm from './avatar-form'


class ProfileCard extends Component {
  constructor(props){
    super(props);
  }



  render() {
    return (
      <div className="ProfileCard">
        <div className="card card-profile mb-4">
          <div className="card-header" style={{backgroundImage: 'url("' + this.props.user.cover +'")' }}></div>
            <div className="card-block text-center">
              <div style={{position: 'relative'}}>
                <a href="../profile/">
                  <div className="card-profile-img" style={{backgroundImage: 'url(' + this.props.user.img + ')'}}>
                  </div>
                </a>
                <AvatarForm user={this.props.user} updateUser={this.props.updateUser.bind(this)} />
              </div>

              <h6 className="card-title">
                <a className="text-inherit" href="../profile">{this.props.user.firstName + ' ' + this.props.user.lastName}</a>
              </h6>

              <p className="mb-4">{this.props.user.bio}</p>

              <ul className="card-menu">
                <li className="card-menu-item">
                  <a id="following" href="#userModal" className="text-inherit" data-toggle="modal">
                    Following
                    <h6 className="my-0">{this.props.user.following.length}</h6>
                  </a>
                </li>

                <li className="card-menu-item">
                  <a id="followers" href="#userModal" className="text-inherit" data-toggle="modal">
                    Followers
                    <h6 className="my-0">{this.props.user.followers.length}</h6>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

    );
  }
}

export default ProfileCard;
