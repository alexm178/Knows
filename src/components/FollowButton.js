import React, { Component } from 'react';
import axios from 'axios';

class FollowButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFollowing: null
    }
  }

  componentWillMount() {
    this.setState({isFollowing: this.props.isFollowing})
  }

  follow() {
    axios.put('/user/follow?id=' + this.props.id).then(
      response => {
        if (response.data.err) {
          alert("Something went wrong :(")
        } else {
          this.setState({isFollowing: true});
          this.props.emit('follow', {
            userId: this.props.id,
            notification: {
              user: {
    						name: this.props.user.firstName + ' ' + this.props.user.lastName,
    						id: this.props.user._id
    					},
              action: 'followed you.'
            }
          })
        }
      }
    )
  }

  render() {
    if (this.props.id === this.props.user._id) {
      return (<button className="btn btn-secondary disabled btn-sm float-right">You</button>)
    } else {
      return (
        <button onClick={this.state.isFollowing ? () => {return false} : this.follow.bind(this)} className={"btn " + (this.state.isFollowing ? "btn-secondary disabled" : "btn-primary") +  " btn-sm float-right"}>
          <span className={"icon " +(this.state.isFollowing ? "icon-check" : "icon-add-user")  + " mr-1"}></span>
          {this.state.isFollowing ? "Following" : "Follow"}
        </button>
      );
    }
  }
}

export default FollowButton;
