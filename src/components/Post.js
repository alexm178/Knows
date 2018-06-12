import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import PostAction from './PostAction'
import CommentForm from'./CommentForm'
import CommentList from './CommentList'
import TimeAgo from './TimeAgo'



class Post extends Component {
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      commentCount: null,
      comments: []
    }
  }


  addComment(newComment) {
    var comments = this.state.comments;
    comments.push(newComment);
    var newCommentCount = this.state.commentCount + 1
    this.setState({
      comments: comments,
      commentCount: newCommentCount
    })
  }

  populateComments(comments) {
    this.setState({
      comments: comments
    })
  }


  componentDidMount() {
    if (this.props.post.new) {
      this.setState({height: 'auto'}, () => {
        var newPost = this.props.post;
        newPost.new = false;
        setTimeout(function() {
          this.props.updatePost(newPost)
        }.bind(this), 500)
      })
    }
  }

  componentWillMount() {
    this.setState({commentCount: this.props.post.comments.length})
  }


  render() {
    if (this.props.post.new) {
      return(
        <AnimateHeight
          duration={ 500 }
          height={ this.state.height }
        >

        <li id={this.props.post.id} className="card media list-group-item p-4 post">
          <div
            className="media-object d-flex align-self-start mr-3"
            style={{backgroundImage: "url('" + this.props.post.author.img + "')", backgroundSize: "cover", backgroundPosition: "center"}}>            </div>
              <div className="media-body">
                <div className="media-body-text">
                  <div className="media-heading">
                    <small className="float-right text-muted"><TimeAgo date={this.props.post.date}/></small>
                    <h6>
                      <a href='../profile/<%%>'>{this.props.post.author.name}</a>
                    </h6>
                  </div>
                  <p>
                    {this.props.post.content}
                  </p>
                </div>
              </div>

              <PostAction post={this.props.post} user={this.props.user} commentCount={this.state.commentCount} populateComments={this.populateComments.bind(this)}/>

              <ul className="media-list comment-list">


              <CommentList comments={this.state.comments} />

              <CommentForm user={this.props.user} post={this.props.post} addComment={this.addComment.bind(this)}/>

              </ul>
            </li>

        </AnimateHeight>
      )
    } else {
      return (
        <li id={this.props.post.id} className="card media list-group-item p-4 post">
            <div
                className="media-object d-flex align-self-start mr-3"
                style={{backgroundImage: "url('" + this.props.post.author.img + "')", backgroundSize: "cover", backgroundPosition: "center"}}>
            </div>
            <div className="media-body">
              <div className="media-body-text">
                <div className="media-heading">
                  <small className="float-right text-muted"><TimeAgo date={this.props.post.date}/></small>
                  <h6>
                    <a href='../profile/<%%>'>{this.props.post.author.name}</a>
                  </h6>
                </div>
              <p>
                {this.props.post.content}
              </p>
            </div>

            <PostAction post={this.props.post} user={this.props.user} commentCount={this.state.commentCount} populateComments={this.populateComments.bind(this)}/>

            <ul className="media-list comment-list">


            <CommentList comments={this.state.comments} />

            <CommentForm user={this.props.user} post={this.props.post} addComment={this.addComment.bind(this)}/>

            </ul>
          </div>
        </li>
      );
    }
  }
}

export default Post;
