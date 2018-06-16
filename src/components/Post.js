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
      comments: [],
      likeCount: null
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

  hideComments() {
    this.setState({comments: []})
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
    this.setState({
      commentCount: this.props.post.commentCount,
      likeCount: this.props.post.likeCount
    })
  }


  render() {
    if (this.props.post.new) {
      return(
        <AnimateHeight
          duration={ 500 }
          height={ this.state.height }
        >

        <li id={this.props.post._id} className="card media list-group-item p-4 pb-2 post">
          <div
            className="media-object d-flex align-self-start mr-3"
            style={{backgroundImage: "url('" + this.props.post.author.img + "')", backgroundSize: "cover", backgroundPosition: "center"}}>            </div>
              <div className="media-body">
                <div className="media-body-text">
                  <div className="media-heading">
                    <small className="float-right text-muted"><TimeAgo date={this.props.post.date}/></small>
                    <h6>
                      <a href={'/profile/' + this.props.post.author._id}>{this.props.post.author.firstName + ' ' + this.props.post.author.lastName}</a>
                    </h6>
                  </div>
                  <p>
                    {this.props.post.content}
                  </p>
                </div>
              </div>

              <PostAction emit={this.props.emit.bind(this)} post={this.props.post} commentCount={this.state.commentCount} likeCount={this.state.likeCount} user={this.props.user} populateComments={this.populateComments.bind(this)} hideComments={this.hideComments.bind(this)}/>

              <ul className="media-list comment-list">


              <CommentList comments={this.state.comments} />

              <CommentForm emit={this.props.emit.bind(this)} user={this.props.user} post={this.props.post} addComment={this.addComment.bind(this)}/>

              </ul>
            </li>

        </AnimateHeight>
      )
    } else {
      return (
        <li id={this.props.post._id} className="card media list-group-item p-4 pb-2 post">

            <a  href={'/profile/' + this.props.post.author._id}
                className="media-object d-flex align-self-start mr-3"
                style={{backgroundImage: "url('" + this.props.post.author.img + "')", backgroundSize: "cover", backgroundPosition: "center"}}>
            </a>
            <div className="media-body">
              <div className="media-body-text">
                <div className="media-heading">
                  <small className="float-right text-muted"><TimeAgo date={this.props.post.date}/></small>
                  <h6>
                    <a href={'/profile/' + this.props.post.author._id}>{this.props.post.author.firstName + ' ' + this.props.post.author.lastName}</a>
                  </h6>
                </div>
              <p>
                {this.props.post.content}
              </p>
            </div>

            <PostAction emit={this.props.emit.bind(this)} post={this.props.post} user={this.props.user} commentCount={this.state.commentCount} likeCount={this.state.likeCount} populateComments={this.populateComments.bind(this)} hideComments={this.hideComments.bind(this)}/>

            <ul className="media-list comment-list">


            <CommentList comments={this.state.comments} />

            <CommentForm emit={this.props.emit.bind(this)} user={this.props.user} post={this.props.post} addComment={this.addComment.bind(this)}/>

            </ul>
          </div>
        </li>
      );
    }
  }
}

export default Post;
