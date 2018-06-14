import React, { Component } from 'react';
import axios from 'axios'
import Signup from './components/signup';
import Login from './components/login';
import Dash from './components/dash';
import Profile from './components/Profile'
import {Route, Link, Redirect, Switch} from 'react-router-dom'
import io from 'socket.io-client';




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: 'loading',
      socket: null,
      notifications: []
    }
  }

  updateUser(data) {
    this.setState(data)
  }

  componentWillMount() {
    axios.get('/auth').then(
      response => {
        this.setState(response.data, () => {
          this.initializeSocket()
        })
      }
    ).catch(err => console.log(err))
  }


  initializeSocket() {
    if (this.state.authenticated) {
      this.setState({socket: io()}, () => {
        const socket = this.state.socket;
        socket.on('id', () => {
          socket.emit('id', this.state.user._id)
        })
        socket.on('notification', (notification) => {
          this.handleNotification(notification)
        });
      })
    }
  }

  emit(name, data) {
    const socket = this.state.socket;
    socket.emit(name, data)
  }

  handleNotification(notification) {
    var notifications = this.state.notifications;
    notifications.push(notification);
    this.setState({notifications: notifications})
  }

  render() {
    if (this.state.user === 'loading') {
      return (<div className="spinner"><div className="dot1"></div><div className="dot2"></div></div>)
    } else {
      return(
        <Switch>
    			<Route
    				exact path ="/"
    				render={props => {
              if(this.state.authenticated) {
                return(<Redirect to='/dash' />)
              } else {
                return(<Redirect to='/login' />)
              }
            }}
    			/>
    			<Route
    				exact path ="/dash"
    				render={props => {
              if(this.state.authenticated) {
                return (
                  <Dash user={this.state.user} updateUser={this.updateUser.bind(this)} notifications={this.state.notifications} emit={this.emit.bind(this)}/>
                )
              } else {
                return (
                  <Redirect to='/login'/>
                )
              }
            }}
    			/>
          <Route
    				path ="/dash/:id"
    				render={props => {
              if(this.state.authenticated) {
                return (
                  <Dash user={this.state.user} updateUser={this.updateUser.bind(this)} notifications={this.state.notifications} emit={this.emit.bind(this)} postId={props.match.params.id}/>
                )
              } else {
                return (
                  <Redirect to='/login'/>
                )
              }
            }}
    			/>
          <Route
    				path ="/profile/:id"
    				render={props => {
              if(this.state.authenticated) {
                return (
                  <Profile user={this.state.user} updateUser={this.updateUser.bind(this)} profileId={props.match.params.id} notifications={this.state.notifications} emit={this.emit.bind(this)}/>
                )
              } else {
                return (
                  <Redirect to='/login'/>
                )
              }
            }}
    			/>
    			<Route
    				exact path ="/login"
    				render={props => {
              if(this.state.authenticated) {
                return (
                  <Redirect to='/dash' />
                )
              } else {
                return (
                  <Login updateUser={this.updateUser.bind(this)} />
                )
              }
            }}
    			/>
          <Route
            exact path ="/signup"
            render={props => {
              if(this.state.authenticated) {
                return (
                  <Redirect to='/dash' />
                )
              } else {
                return (
                  <Signup updateUser={this.updateUser.bind(this)} />
                )
              }
            }}
          />
    		</Switch>
      )
    }
  }
}

export default App;
