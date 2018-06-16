import React, { Component } from 'react';
import axios from 'axios'
import Modal from './modal'
import UserListItem from './UserListItem'



class PostAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      displayModal: false,
      likes: [],
      liked: null,
      likeCount: null,
      new: false,
      displayComments: false,
      arrow: 'down'
    }
  }

  displayLikes(event) {
    event.preventDefault();
    axios.get('/post/likes?id=' + this.props.post._id).then(
      response => {
        var likes = response.data.likes.map(like => {
          return(
            <UserListItem key={like._id} emit={this.props.emit.bind(this)} person={like} user={this.props.user} />
          )
        })
        this.setState({
          displayModal: true,
          likes: likes
        })
      }
    ).catch(
      err => {
        console.log(err);
        alert('Could not fetch likes :(')
      }
    )
  }

  like() {
    axios.put('/post/like?id=' + this.props.post._id).then(
      response => {
        var newLikeCount = this.state.likeCount + 1
        this.setState({
          liked: true,
          likeCount: newLikeCount
        });
        this.props.emit('likeOrComment', {
          authorId: this.props.post.author._id,
          notification: {
            user: {
  						name: this.props.user.firstName + ' ' + this.props.user.lastName,
  						id: this.props.user._id
  					},
            action: 'liked',
  					target: {
  						type: this.props.post.type,
  						id: this.props.post._id
  					}
          }
				})
      }
    ).catch(
      err => {
        console.log(err);
        alert('Like failed :(')
      }
    )
  }

  displayComments(event) {
    event.preventDefault();
    axios.get('/post/comments?id=' + this.props.post._id).then(
      response => {
        this.props.populateComments(response.data.comments);
        this.setState({
          displayComments: true,
          arrow: 'up'
        })
      }
    ).catch(
      err => {
        console.log(err);
        alert('Something went wrong :(')
      }
    )
  }

  hideComments(event) {
    event.preventDefault();
    this.props.hideComments()
    this.setState({
      displayComments: false,
      arrow: 'down'
    })
  }

  closeModal() {
    this.setState({displayModal: false})
  }

  componentWillMount() {
    this.setState({
      liked: this.props.post.liked,
      likeCount: this.props.likeCount
    })
  }

  render() {
      return(
        <div className='d-flex postAction mb-2'>
          <div className="mr-auto pt-1">
            <a href="like" onClick={this.displayLikes.bind(this)} className="likes mr-2"><span className="icon icon-heart"></span><span className="likeCount">{' ' + this.state.likeCount}</span></a>
            <a href="comments" onClick={this.state.displayComments ? this.hideComments.bind(this) : this.displayComments.bind(this)} className="comments"><span className="icon icon-message"></span><span className="commentCount">{' ' + this.props.commentCount }</span><span className={"icon icon-chevron-small-" + this.state.arrow}></span></a>
          </div>
          <div>

            {!this.state.liked &&
              <button onClick={this.like.bind(this)} className='btn btn-sm btn-outline-secondary mr-2'><span className='icon icon-heart' style={{color: '#3097D1'}}></span></button>
            }

            <button className='btn btn-sm btn-outline-secondary'><span className='icon icon-retweet' style={{color: '#3097D1'}}></span></button>
          </div>
          {this.state.displayModal &&
            <Modal
              title='Likes:'
              body={<ul className="media-list media-list-users list-group">{this.state.likes}</ul>}
              close={this.closeModal.bind(this)}
            />
          }
        </div>
      );
  }
}

export default PostAction;
