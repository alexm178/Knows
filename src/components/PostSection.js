import React, { Component } from 'react';
import axios from 'axios'
import PostForm from './PostForm';
import PostList from './PostList'




class PostSection extends Component {
  constructor(props){
    super(props);
    this.state ={
      posts: [],
      loading: true
    }
  }

  newPost(newPost) {
    var posts = this.state.posts;
    posts.push(newPost);
    this.setState({posts: posts})
  }

  updatePost(newPost) {
    var posts = this.state.posts
    var index = posts.find((post) => {
      return post._id === newPost._id
    })
    posts.splice(index, 1, newPost);
    this.setState({posts: posts})
  }

  componentWillMount() {
    if (this.props.profile) {
      var url = ''
    } else {
      url = '/post/dash?id=' + this.props.user._id
    }
    axios.get(url).then(
      response => {
        this.setState({
          posts: response.data.posts,
          loading: false
        })
      }
    ).catch(
      err => {
        console.log(err);
        alert('Something went wrong :(')
      }
    )
  }

  render() {
    return (
      <div className='Posts'>
        {!this.props.profile &&
        <PostForm user={this.props.user} newPost={this.newPost.bind(this)}/>
        }
        < PostList user={this.props.user} posts={this.state.posts} updatePost={this.updatePost.bind(this)} loading={this.state.loading}/>
      </div>
    );
  }
}

export default PostSection;
