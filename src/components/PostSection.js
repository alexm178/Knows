import React, { Component } from 'react';
import PostForm from './PostForm';
import Post from './Post'


class PostSection extends Component {
  constructor(props){
    super(props);
    this.state ={}
  }



  render() {
    var sortedPostList = this.props.user.posts.sort((a, b) => {
      return b.date - a.date;
    })
    var postList= sortedPostList.map((postObject) =>
      <Post key={postObject._id} post={postObject} user={this.props.user} updateUser={this.props.updateUser}/>
    )
    return (
      <div className='Posts'>
        < PostForm user={this.props.user} updateUser={this.props.updateUser}/>
        <ul className="list-group media-list media-list-stream mb-4">{postList}</ul>
      </div>
    );
  }
}

export default PostSection;
