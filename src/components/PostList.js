import React, { Component } from 'react';
import Post from './Post'

class PostSection extends Component {
  constructor(props){
    super(props);
    this.state = {
      posts: [],
    }
  }


  componentWillReceiveProps(props) {
    if (props.posts) {
      var sortedPostList = props.posts.sort((a, b) => {
        return b.date - a.date;
      })
      var posts = sortedPostList.map((post) => {
        return <Post key={post._id} post={post} user={props.user} updatePost={props.updatePost.bind(this)} emit={this.props.emit.bind(this)}/>
      })
      this.setState({posts: posts})
    }
  }

  render() {
    if(this.props.loading) {
      return(<div className="spinner"><div className="dot1"></div><div className="dot2"></div></div>)
    } else {
      return(
        <ul className="list-group media-list media-list-stream mb-4">{this.state.posts}</ul>
      )
    }
  }
}

export default PostSection;