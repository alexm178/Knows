import React, { Component } from 'react';
import axios from 'axios'
import brandwhite from '../brand-white.png'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: "collapse",
      search: '',
      redirectTo: null
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

  toggleNavbar() {
    if (this.state.collapse === false) {
      this.setState({
        collapse: "collapse"
      });
    } else {
      this.setState({
        collapse: false
      });
    }
  }

  handleChange(event) {
    this.setState({
      search: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.get("/search?terms=" + this.state.search).then(
      response => {
        this.props.history.push({pathname: "/search"})
        this.setState({
          results: response.data.results,
          redirectTo: "/search"
        })
      }
    ).catch(
      err => {
        console.log(err);
        alert("Something went wrong")
      }
    )
  }

  render() {
      return (
        <nav className="navbar navbar-toggleable-sm fixed-top navbar-inverse bg-primary app-navbar">
          <button
            className="navbar-toggler navbar-toggler-right hidden-md-up"
            onClick={this.toggleNavbar.bind(this)}
            >
            <span className="navbar-toggler-icon"></span>
          </button>



          <a className="navbar-brand" href="/dash">
            <img src={brandwhite} alt="brand" />
          </a>


          <div className={"navbar-collapse " + this.state.collapse} id="navbarResponsive">
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
                <a onClick={this.logOut.bind(this)} className="nav-link">Logout</a>
              </li>

            </ul>

            <form onSubmit={this.handleSubmit.bind(this)} className="form-inline float-right hidden-sm-down">
              <input onChange={this.handleChange.bind(this)} className="form-control" type="text" value={this.state.search} placeholder="Search" />
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
          </div>
        </nav>
      );
  }
}

export default Navbar
