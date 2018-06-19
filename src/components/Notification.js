import React, { Component } from 'react';




class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    }
  }



  componentWillReceiveProps(){
    var formattedNotifications = this.props.notifications.map((notification, index) => {
      return (
        <div key={index} className="alert alert-dark alert-dismissible fade show" role="alert">
        <button className="close" onClick={() => {this.props.dismissNotification(index)}}><span aria-hidden="true">×</span></button>
          <a href={'/profile/' + notification.user.id}>
            {notification.user.name}
          </a>
          {notification.target &&
            <span>{' ' + notification.action + ' your '}
            <a href={'/dash/' + notification.target.id}>{notification.target.type + '.'}</a>
            </span>
          }
          {!notification.target &&
            <span>{' ' + notification.action}</span>
          }
        </div>
      )
    })
    this.setState({notifications: formattedNotifications})
  }

  render() {
    return (
      <div className="growl" id="app-growl">{this.state.notifications}</div>
    );
  }
}

export default Notification;
