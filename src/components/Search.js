import React, { Component } from 'react';
import axios from "axios";
import ProfileCard from "./profile-card";
import Navbar from "./navbar";
import Post from "./Post";


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileCards: [],
      posts: []
    }
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
    axios.get("/search" + this.props.query).then(results => {
      var profileCards = results.data.users.map(user => {
        return (

          < ProfileCard className="col-md-6 col-lg-3 mr-2" key={user._id} user={user} owner={false} emit={this.props.emit.bind(this)} userViewing={this.props.user} isFollowing={this.props.user.following.some((follow) => {return follow === user._id})}/>
        )
      });
      var posts = results.data.posts.map((post) => {
        return <Post className="col-md-6 col-lg-3 mr-2" key={post._id} post={post} user={this.props.user} updatePost={this.updatePost.bind(this)} emit={this.props.emit.bind(this)}/>
      })
      this.setState({
        profileCards: profileCards,
        posts: posts
      })
    }).catch(err => {
      console.log(err);
      alert("Something went wrong")
    })
  }

  render() {
    return (
      <div className="Search with-top-navbar">
        <Navbar user={this.props.user} updateUser={this.props.updateUser}/>
        <div className="container pt-4">
        <div className="container-inner">
          <div className="row">

            {this.state.profileCards}
            {this.state.posts}


            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Search;
