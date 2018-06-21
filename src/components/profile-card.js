import React, { Component } from 'react';
import AvatarForm from './avatar-form';
import axios from 'axios';
import UserListItem from './UserListItem';
import Modal from './modal';
import FollowButton from './FollowButton'


class ProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      follows: [],
      displayModal: false,
      title: ''
    }
  }

  getFollows(which) {
    axios.get('/user/follows/' + which + '?id=' + this.props.user._id).then(
      response => {
        var follows = response.data.follows.map(follow => {
          return(
            <UserListItem isProfile={false} emit={this.props.emit.bind(this)} key={follow._id} person={follow} user={this.props.user} />
          )
        });
        this.setState({
          displayModal: true,
          follows: follows,
          title: (which === "following" ? "Following:" : "Followers:")
        })
      }
    )
  }

  closeModal() {
    this.setState({displayModal: false})
  }


  render() {
    return (
      <div className="ProfileCard">
        <div className="card card-profile mb-4">
          <div className="card-header" style={{backgroundImage: 'url("' + this.props.user.cover +'")' }}></div>
            <div className="card-block text-center">
              <div style={{position: 'relative'}}>
                <a href={"/profile/" + this.props.user._id}>
                  <div className="card-profile-img" style={{backgroundImage: 'url(' + this.props.user.img + ')'}}>
                  </div>
                </a>
                {this.props.owner &&
                  <AvatarForm user={this.props.user} updateUser={this.props.updateUser.bind(this)} />
                }
              </div>

              <h6 className="card-title">
                <a className="text-inherit" href="../profile">{this.props.user.firstName + ' ' + this.props.user.lastName}</a>
              </h6>

              <p className="mb-4">{this.props.user.bio}</p>

              <div className="mb-2">
              {!this.props.owner &&
                <FollowButton isFollowing={this.props.isFollowing} id={this.props.user._id} isProfile={true} user={this.props.userViewing}/>
              }
              </div>

              <div>
                <ul className="card-menu">
                  <li onClick={() => {this.getFollows("following")}} className="card-menu-item">
                    <a id="following" href="#userModal" className="text-inherit" data-toggle="modal">
                      Following
                      <h6 className="my-0">{this.props.user.following.length}</h6>
                    </a>
                  </li>

                  <li onClick={() => {this.getFollows("followers")}} className="card-menu-item">
                    <a id="followers" href="#userModal" className="text-inherit" data-toggle="modal">
                      Followers
                      <h6 className="my-0">{this.props.user.followers.length}</h6>
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>
          {this.state.displayModal &&
            <Modal
              title={this.state.title}
              body={<ul className="media-list media-list-users list-group">{this.state.follows}</ul>}
              close={this.closeModal.bind(this)}
            />
          }
        </div>

    );
  }
}

export default ProfileCard;
