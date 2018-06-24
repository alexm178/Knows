import React, { Component } from 'react';
import axios from "axios";
import ProfileCard from "./profile-card";
import Navbar from "./navbar";
import Post from "./Post";
import Slider from "react-slick"




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
      console.log(results)
      var profileCards = results.data.users.map(user => {
        return (

          < ProfileCard key={user._id} user={user} owner={false} emit={this.props.emit.bind(this)} userViewing={this.props.user} isFollowing={this.props.user.following.some((follow) => {return follow === user._id})}/>
        )
      });
      var posts = results.data.posts.map((post) => {
        return <div className="search"><Post key={post._id} post={post} user={this.props.user} updatePost={this.updatePost.bind(this)} emit={this.props.emit.bind(this)}/></div>
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




            <Slider
              className="mr-2"
              responsive={[
                { breakpoint: 768,
                  settings: { slidesToShow: 3 }
                },
                { breakpoint: 1024,
                  settings: { slidesToShow: 5 }
                } ]	}
            >
            {this.state.posts}
            </Slider>
            {this.state.profileCards}




        </div>
      </div>
    );
  }
}

export default Search;
