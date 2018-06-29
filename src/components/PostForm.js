import React, { Component } from 'react';
import axios from 'axios';
import ProjectForm from "./ProjectForm"



class PostForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      content: '',
      project: true,
    }
  }

  toggleProject() {
    var bool = this.state.project;
    this.setState({project: !bool})
  }

  handleChange(event) {
    this.setState({
      content: event.target.value
    })
  }

  handleSubmit(event) {
    axios.post('/post', {
      content: this.state.content,
      author: this.props.user._id,
      date: Date.now(),
      type: 'post',
      commentCount: 0,
      likeCount: 0
    }).then(response => {
      var newPost = response.data.post;
      newPost.new = true;
      newPost.author = {
        _id: this.props.user._id,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        img: this.props.user.img
      }
      this.props.newPost(newPost)
      this.setState({content: ''})
    }).catch(err => {
      console.log(err)
    })
    event.preventDefault()
  }

  render() {
    return (
      <div id='postCardT' className="card media list-group-item d-flex">
        <div className="project-tab">
          <div onClick={this.toggleProject.bind(this)} className="pro-tab btn-primary">
            <p className="project-text">Post<span className="icon icon-plus"></span></p>
            {!this.state.project &&
              <div className="caret"></div>
            }
          </div>
          <div onClick={this.toggleProject.bind(this)} className="pro-tab btn-info">
            <p className="project-text">Project <span className="icon icon-add-to-list"></span></p>
            {this.state.project &&
              <div className="caret"></div>
            }
          </div>
        </div>
        {this.state.project ? <ProjectForm /> :
          <div className="main-form ">
            <form onSubmit={this.handleSubmit.bind(this)} id='postFormT' method='post'>
              <textarea onChange={this.handleChange.bind(this)} className='pl-1 post-input' value={this.state.content} placeholder='What are you working on?'></textarea>
            </form>
            <div className="post-btns text-muted">
              <span className="icon icon-camera"></span>
              <span onClick={this.handleSubmit.bind(this)} className="icon icon-paper-plane ml-2"></span>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default PostForm;
