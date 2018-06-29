import React, { Component } from 'react';
import axios from 'axios'
import PostForm from './PostForm';
import PostList from './PostList'




class PostSection extends Component {
  constructor(props){
    super(props);
    this.state ={
      posts: [],
      mongoSkip: 0,
      fetching: false,
      end: false
    }
  }

  newPost(newPost) {
    var posts = this.state.posts;
    posts.push(newPost);
    this.setState({posts: posts})
  }

  getPosts() {
    if (this.props.profile) {
      var url = '/post/profile/' + this.props.profileId + '/?skip=' + this.state.mongoSkip;
    } else if (this.props.postId) {
      url = '/post/dash/' + this.props.postId
    } else {
      url = '/post/dash?skip=' + this.state.mongoSkip
    }
    axios.get(url).then(
      response => {
        if (response.data.posts.length === 0) {
          this.setState({end: true})
        } else {
          var mongoSkip = this.state.mongoSkip + 25;
          var posts = this.state.posts;
          response.data.posts.forEach((post) => {
            posts.push(post);
          })
          this.setState({
            posts: posts,
            mongoSkip: mongoSkip,
            fetching: false
          })
        }
      }
    ).catch(
      err => {
        console.log(err);
        alert('Something went wrong :(')
      }
    )
  }


  componentWillMount() {
    this.getPosts()
  }

  handleScroll(event) {
    if (window.pageYOffset / document.documentElement.scrollHeight > .8 && !this.state.fetching && !this.state.end) {
      this.setState({fetching: true}, () => {
        this.getPosts()
      })
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this))
  }

  render() {
    return (
      <div className='Posts'>
        {(!this.props.profile || (this.props.profileId === this.props.user._id)) &&
        <PostForm user={this.props.user} newPost={this.newPost.bind(this)}/>
        }
        < PostList user={this.props.user} posts={this.state.posts} emit={this.props.emit.bind(this)}/>
        {!this.state.end &&
          <div className="spinner"><div className="dot1"></div><div className="dot2"></div></div>
        }
      </div>
    );
  }
}

export default PostSection;
