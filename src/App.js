import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Signup from './components/signup';
import Login from './components/login';
import Dash from './components/dash';
import Modal from './components/modal'
import {Route, Link, Redirect, Switch} from 'react-router-dom'
import entypo from 'entypo'
import {RingLoader} from 'react-spinners'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: 'loading',
    }
  }

  updateUser(data) {
    this.setState(data)
  }

  componentWillMount() {
    axios.get('/auth').then(
      response => {
        this.updateUser(response.data)
      }
    ).catch(err => console.log(err))
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
                  <Dash user={this.state.user} updateUser={this.updateUser.bind(this)} />
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
