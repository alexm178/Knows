import React, { Component } from 'react';
import axios from 'axios'
import PostForm from './PostForm';
import PostList from './PostList'




class PostSection extends Component {
  constructor(props){
    super(props);
    this.state ={
      posts: [],
      loading: true,
      mongoSkip: 0
    }
  }

  newPost(newPost) {
    var posts = this.state.posts;
    posts.push(newPost);
    console.log(posts)
    this.setState({posts: posts})
  }


  componentWillMount() {
    if (this.props.profile) {
      var url = '/post/profile/' + this.props.profileId + '/?skip=' + this.state.mongoSkip;
    } else if (this.props.postId) {
      url = '/post/dash/' + this.props.postId + '/?skip=' + this.state.mongoSkip;
    } else {
      url = '/post/dash'
    }
    axios.get(url).then(
      response => {
        var mongoSkip = this.state.mongoSkip;
        mongoSkip += 25;
        this.setState({
          posts: response.data.posts,
          loading: false,
          mongoSkip: mongoSkip
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
        {(!this.props.profile || (this.props.profileId === this.props.user._id)) &&
        <PostForm user={this.props.user} newPost={this.newPost.bind(this)}/>
        }
        < PostList user={this.props.user} posts={this.state.posts} loading={this.state.loading} emit={this.props.emit.bind(this)}/>
      </div>
    );
  }
}

export default PostSection;
