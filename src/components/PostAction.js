import React, { Component } from 'react';
import axios from 'axios'
import Modal from './modal'


class PostAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      displayModal: false,
      likes: [],
      liked: null
    }
  }

  displayLikes(event) {
    event.preventDefault();
    var likes = this.props.post.likes.map(like => {
      return(
        <li key={like.id} className="list-group-item">
          <div className="media w-100">
            <div className="media-object d-flex align-self-start mr-3" style={{backgroundImage: "url('" + like.img + "')", backgroundSize: "cover", backgroundPosition: "center", height: "42px"}}>
            </div>
            <div className="media-body">
              <button className="btn btn-primary btn-sm float-right">
                <span className="icon icon-add-user mr-1"></span>
                Follow
              </button>
            <a><strong>{like.name}</strong></a>
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

  like() {
    var like = {
      id: this.props.user._id,
      name: this.props.user.firstName + ' ' + this.props.user.lastName,
      img: this.props.user.img
    }
    axios.put('/post/like?id=' + this.props.post._id, like).then(
      response => {
        var likes = this.state.likes;
        likes.push(like)
        this.setState({
          likes: likes,
          liked: true
        })
      }
    ).catch(
      err => {
        console.log(err);
        alert('Like failed :(')
      }
    )
  }

  closeModal() {
    this.setState({displayModal: false})
  }

  componentWillMount() {
    this.setState({likes: this.props.post.likes}, () => {
      var liked = false;
      this.props.post.likes.forEach((like) => {
        if (like.id === this.props.user._id) {
          liked = true;
        }
      })
      this.setState({liked: liked})
    })
  }

  render() {
    return(
      <div className='d-flex postAction'>
        <div className="mr-auto pt-1">
          <a onClick={this.displayLikes.bind(this)} className="likes mr-2"><span className="icon icon-heart"></span><span className="likeCount">{' ' + this.state.likes.length}</span></a>
          <a className="comments"><span className="icon icon-message"></span><span className="commentCount">{' ' + this.props.post.comments.length }</span></a>
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
