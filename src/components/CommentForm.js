import React, { Component } from 'react';
import axios from 'axios'
import AnimateHeight from 'react-animate-height';
import PostAction from './PostAction'



class CommentForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      content: ''
    }
  }

  handleChange(event) {
    this.setState({content: event.target.value})
  }

  handleSubmit(event) {
    var url = '/post/comment/' + this.props.post._id;
    axios.post(url, {
      content: this.state.content,
      date: Date.now(),
      author: this.props.user._id,
      post: this.props.post._id,
    }).then(
      response => {
        console.log(response)
        var comment = response.data.comment;
        comment.author =  {
          _id: this.props.user._id,
          img: this.props.user.img,
          firstName: this.props.user.firstName,
          lastName: this.props.user.lastName
        };
        this.props.addComment(comment)
        this.setState({content: ''})
        this.props.emit('likeOrComment', {
          authorId: this.props.post.author._id,
          notification: {
            user: {
  						name: this.props.user.firstName + ' ' + this.props.user.lastName,
  						id: this.props.user._id
  					},
            action: 'commented on',
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
        alert('Something went wrong :(')
      }
    )
    event.preventDefault()
  }

  render() {
    return(
      <li className="media comment-form p-1">
        <div
          className="media-object d-flex align-self-start mr-1" style={{backgroundImage: 'url(' + this.props.user.img + ')', height: '30px', width: '30px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'inline-block'}}>
        </div>
        <div className="media-body">
          <form className="com-form" onSubmit={this.handleSubmit.bind(this)}>
            <input className="com-in pl-1" value={this.state.content} onChange={this.handleChange.bind(this)} type="text" placeholder="Write a comment..." />
          </form>
        </div>
      </li>
    );
  }
}

export default CommentForm;
