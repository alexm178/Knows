import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height'



class Post extends Component {
  constructor(props){
    super(props);
    this.state = {
      height: 0
    }
  }

  formatDate(time) {
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }

  componentDidMount() {
    if (this.props.post.new) {
      this.setState({height: 'auto'}, () => {
        var newPost = this.props.post;
        newPost.new = false;
        var newUser = this.props.user;
        newUser.posts[0] = newPost;
        setTimeout(function() {
          this.props.updateUser({user: newUser})
        }.bind(this), 500)
      })
    }
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
                    <small className="float-right text-muted"><span className="timeStamp">{this.formatDate(this.props.post.date)}</span></small>
                    <h6>
                      <a href='../profile/<%%>'>{this.props.post.author.name}</a>
                    </h6>
                  </div>
                  <p>
                    {this.props.post.content}
                  </p>
                </div>
              </div>
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
            <div className="media-body">              <div className="media-body-text">
              <div className="media-heading">
                <small className="float-right text-muted"><span className="timeStamp">{this.formatDate(this.props.post.date)}</span></small>
                <h6>
                  <a href='../profile/<%%>'>{this.props.post.author.name}</a>
                </h6>
              </div>
              <p>
                {this.props.post.content}
              </p>
            </div>
          </div>
        </li>
      );
    }
  }
}

export default Post;
