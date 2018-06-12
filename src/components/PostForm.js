import React, { Component } from 'react';
import axios from 'axios'


class PostForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      content: ''
    }
  }

  handleChange(event) {
    this.setState({
      content: event.target.value
    })
  }

  handleSubmit(event) {
    axios.post('/post', {
      content: this.state.content,
      author: {
        name: this.props.user.firstName + ' ' + this.props.user.lastName,
        img: this.props.user.img
      },
      date: Date.now()
    }).then(response => {
      var newPost = response.data.post;
      newPost.new = true;
      this.props.newPost(newPost)
      this.setState({content: ''})
    }).catch(err => {
      console.log(err)
    })
    event.preventDefault()
  }

  render() {
    return (
      <div id='postCard' className="card media list-group-item p-4">
        <form onSubmit={this.handleSubmit.bind(this)} id='postForm' method='post'>
          <textarea onChange={this.handleChange.bind(this)} value={this.state.content} id='postInput' form='newPost' name='postInput' placeholder='What are you working on?'></textarea>
          <div id='postButtons'>
            <button className='btn btn-md btn-secondary mr-2'><span className='icon icon-camera'></span></button>
            <button onClick={this.handleSubmit.bind(this)} className='btn btn-md btn-primary'><span className='icon icon-paper-plane'></span></button>
          </div>
        </form>
      </div>
    );
  }
}

export default PostForm;
