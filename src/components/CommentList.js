import React, { Component } from 'react';
import TimeAgo from './TimeAgo'



class CommentList extends Component {
  constructor(props){
    super(props);
  }

  formatComments() {
    var formattedComments = this.props.comments.map(comment => {
      return(
        <li className="media mb-3" key={comment._id}>
        <a href={'/profile/' + comment.author.id}>
          <img className="media-object d-flex align-self-start mr-3" src={comment.author.img} />
        </a>
        <div className="media-body">
          <div className="media-body-text">
            <div className="media-heading">
              <small className="float-right text-muted">
                <TimeAgo date={comment.date} />
              </small>
              <h6><a href={'/profile/' + comment.author.id}><strong>{comment.author.name}</strong></a></h6>
            </div>
            {comment.content}
          </div>
        </div>
      </li>
      )
    })
    return formattedComments
  }


  render() {
    return (
      <div>
        {this.formatComments()}
      </div>
    );
  }
}

export default CommentList;
