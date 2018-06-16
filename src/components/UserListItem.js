import React, { Component } from 'react';
import FollowButton from './FollowButton'


class UserListItem extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <li className="list-group-item">
        <div className="media w-100">
          <div className="media-object d-flex align-self-start mr-3" style={{backgroundImage: "url('" + this.props.person.img + "')", backgroundSize: "cover", backgroundPosition: "center", height: "42px"}}>
          </div>
          <div className="media-body">

          <FollowButton emit={this.props.emit.bind(this)} isFollowing={this.props.person.isFollowing} id={this.props.person._id} user={this.props.user}/>

          <a href={"/profile/" + this.props.person._id}><strong>{this.props.person.firstName + ' ' + this.props.person.lastName}</strong></a>
          </div>
        </div>
      </li>
    )
  }
}

export default UserListItem;
