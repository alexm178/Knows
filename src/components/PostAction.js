import React, { Component } from 'react';
import axios from 'axios'
import Modal from './modal'
import CommentForm from './CommentForm';
import FollowButton from './FollowButton'



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
            <li key={like._id} className="list-group-item">
              <div className="media w-100">
                <div className="media-object d-flex align-self-start mr-3" style={{backgroundImage: "url('" + like.img + "')", backgroundSize: "cover", backgroundPosition: "center", height: "42px"}}>
                </div>
                <div className="media-body">

                <FollowButton isFollowing={like.isFollowing} id={like._id} userId={this.props.user._id}/>

                <a href={"/profile/" + like._id}><strong>{like.firstName + ' ' + like.lastName}</strong></a>
                </div>
              </div>
            </li>
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

  displayComments() {
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

  hideComments() {
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
            <a onClick={this.displayLikes.bind(this)} className="likes mr-2"><span className="icon icon-heart"></span><span className="likeCount">{' ' + this.state.likeCount}</span></a>
            <a onClick={this.state.displayComments ? this.hideComments.bind(this) : this.displayComments.bind(this)} className="comments"><span className="icon icon-message"></span><span className="commentCount">{' ' + this.props.commentCount }</span><span className={"icon icon-chevron-small-" + this.state.arrow}></span></a>
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
