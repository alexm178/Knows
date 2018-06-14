import React, { Component } from 'react';




class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillReceiveProps(){
    var formattedNotifications = this.props.notifications.map((notification, index) => {
      console.log(notification)
      return (
        <div key={index} className="alert alert-dark alert-dismissible fade show" role="alert"><button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
          <a href={'/profile/' + notification.user.id}>
            {notification.user.name}
          </a>
          {' ' + notification.action + ' ' + notification.possessive + ' '}
          <a href={'/dash/' + notification.target.id}>{notification.target.type + '.'}</a>
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
