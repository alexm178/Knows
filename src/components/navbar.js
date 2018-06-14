import React, { Component } from 'react';
import axios from 'axios'
import {Route, Link, Redirect} from 'react-router-dom'
import brandwhite from '../brand-white.png'
import {Popover} from 'react-bootstrap'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  logOut(event) {
    event.preventDefault();
    axios.post('/logout').then(response => {
      this.props.updateUser(response.data)
    }).catch(err => {
      alert('Error Logging Out')
      console.log(err)
    })
  }

  componentDidMount() {

  }


  render() {
      return (
        <nav className="navbar navbar-toggleable-sm fixed-top navbar-inverse bg-primary app-navbar">
          <button
            className="navbar-toggler navbar-toggler-right hidden-md-up"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <a className="navbar-brand" href="/dash">
            <img src={brandwhite} alt="brand" />
          </a>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/dash">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={"/profile/" + this.props.user._id}>Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="modal" href="#msgModal">Messages</a>
              </li>


              <li className="nav-item hidden-md-up">
                <a className="nav-link" href="../notifications/index.ejs">Notifications</a>
              </li>
              <li className="nav-item hidden-md-up">
                <a className="nav-link" data-action="growl">Growl</a>
              </li>
              <li className="nav-item hidden-md-up">
                <a onClick={this.logOut.bind(this)} className="nav-link">Logout</a>
              </li>

            </ul>

            <form className="form-inline float-right hidden-sm-down">
              <input className="form-control" type="text" data-action="grow" placeholder="Search" />
            </form>

            <ul id="#js-popoverContent" className="nav navbar-nav float-right mr-0 hidden-sm-down">
              <li className="nav-item">
                <a className="app-notifications nav-link" href="../notifications">
                  <span className="icon icon-bell"></span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link app-notifications ml-0" onClick={this.logOut.bind(this)}>
                  <span className="icon icon-log-out"></span>
                </a>
              </li>
              <li className="nav-item ml-2">
                <a className="btn btn-default navbar-btn navbar-btn-avatar" href={'/profile/' + this.props.user._id}>
                  <img alt='avatar' className="rounded-circle" src={this.props.user.img} />
                </a>
              </li>
            </ul>

            <ul className="nav navbar-nav hidden-xs-up" id="js-popoverContent">
              <li className="nav-item"><a className="nav-link" href="#" data-action="growl">Growl</a></li>
              <li className="nav-item"><a className="nav-link" href="../logout">Logout</a></li>
            </ul>
          </div>
        </nav>
      );
  }
}

export default Navbar
