import React, { Component } from 'react';
import axios from 'axios';
import brand from '../brand.png'



class Signup extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      err: false
    }
  }

  handlefirstNameChange(event) {
    this.setState({firstName : event.target.value});
  }

  handleLastNameChange(event) {
    this.setState({lastName : event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email : event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password : event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/user', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    }).then(response => {
      console.log(response)
      if (response.data.authenticated) {
        this.props.updateUser(response.data)
      } else if (response.data.err.message){
        this.setState({err: response.data.err.message})
      }
    }).catch(error => {
      console.log('signup server error');
      console.log(error)
    })
  }


  render() {
    return (
      <div className="Signup">
      <div className="container-fluid container-fill-height">
        <div className="container-content-middle">
          <form onSubmit={this.handleSubmit.bind(this)} className="mx-auto text-center app-login-form">

            <a className="app-brand mb-5">
              <img src={brand} alt="brand" />
            </a>

            {this.state.err &&
              <div className='alert alert-danger'>
              <p>{this.state.err}</p>
              </div>
            }

            <div className="form-group">
              <input type='text' className="form-control" placeholder="First Name" name="firstName" value={this.state.firstName} onChange={this.handlefirstNameChange.bind(this)}/>
            </div>

            <div className="form-group mb-3">
              <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleLastNameChange.bind(this)}/>
            </div>

            <div className="form-group">
              <input className="form-control" placeholder="Email" name="email" value={this.state.email} onChange={this.handleEmailChange.bind(this)}/>
            </div>

            <div className="form-group mb-3">
              <input type="password" className="form-control" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)}/>
            </div>

            <div className="mb-5">
              <button className="btn btn-primary">Sign up</button>
            </div>

          </form>
        </div>
      </div>

      </div>
    );
  }
}

export default Signup;
