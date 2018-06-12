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
      author: {
        id: this.props.user._id,
        name: this.props.user.firstName + ' ' + this.props.user.lastName,
        img: this.props.user.img,
      },
      post: this.props.post._id,
    }).then(
      response => {
        this.props.addComment(response.data.comment)
        this.setState({content: ''})
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
      <li className="media mb-3">
        <div
          className="media-object d-flex align-self-start mr-3" style={{backgroundImage: 'url(' + this.props.user.img + ')', height: '40px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'inline-block'}}>
        </div>
        <div className="media-body">
          <form className="com-form" onSubmit={this.handleSubmit.bind(this)}>
            <input className="com-in mt-2" value={this.state.content} onChange={this.handleChange.bind(this)} type="text" placeholder="Write a comment..." />
          </form>
        </div>
      </li>
    );
  }
}

export default CommentForm;
