import React, { Component } from 'react';
import axios from 'axios';
import brand from '../brand.png'
import {Link} from 'react-router-dom'



class LogIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
    }
  }

  handleEmailChange(event) {
    this.setState({username : event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password : event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/login', this.state).then(response => {
      this.props.updateUser(response.data)
    }).catch(error => {
      this.setState({error: true})
    })
  }


  render() {
    return (
      <div className="Login">
      <div className="container-fluid container-fill-height">
        <div className="container-content-middle">

          <form onSubmit={this.handleSubmit.bind(this)} className="mx-auto text-center app-login-form">

            <a className="app-brand mb-5">
              <img src={brand} alt="brand" />
            </a>

            {this.state.error &&
              <div className='alert alert-danger' style={{height: '47px'}}>
              <p>Incorrect email or password</p>
              </div>
            }

            <div className="form-group">
              <input className="form-control" placeholder="Email" name="email" value={this.state.email} onChange={this.handleEmailChange.bind(this)}/>
            </div>

            <div className="form-group mb-3">
              <input type="password" className="form-control" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)}/>
            </div>

            <div className="mb-5">
              <button className="btn btn-primary">Log In</button>
              <Link to="/signup"><button className="btn btn-secondary">Sign Up</button></Link>
            </div>

          </form>
        </div>
      </div>

      </div>
    );
  }
}

export default LogIn;
