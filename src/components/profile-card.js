import React, { Component } from 'react';
import axios from 'axios';
import iceland from '../iceland.jpg'



class ProfileCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      avStyle: {
        backgroundImage: 'url(' + this.props.user.img + ')',
        height: '100px',
        width: '100px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'inline-block'
      }
    }
  }



  render() {
    return (
      <div className="ProfileCard">
      <div className="card card-profile mb-4">
      <div className="card-header" style={{backgroundImage: {iceland} }}></div>
      <div className="card-block text-center">
        <div style={{position: 'relative'}}>
          <a href="../profile/">
            <div className="card-profile-img" style={this.state.avStyle}>
            </div>
          </a>
          <form id='av-form' method='post' encType="multipart/form-data" action='/user/avatar/<%%>'>
            <label htmlFor='av-in'><div className='btn btn-sm btn-secondary av-btn'><span className='icon icon-camera'></span></div></label>
            <input type='file' name='avatar' id='av-in' />
          </form>
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
