import React, { Component } from 'react';
import axios from 'axios';
import iceland from '../iceland.jpg';
import Modal from './modal'



class AvatarForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: null,
      result: null,
      displayModal: false
    }
  }



  handleReaderLoad(result) {
    console.log(result)
    this.setState({
      result: result,
      displayModal: true
    })
  }

  closeModal() {
    this.setState({
      displayModal: false
    })
  }

  handleChange(event){

    let reader = new FileReader();
    var file = event.target.files[0]
    this.setState({file: file})

    reader.onloadend = (event) => {
      this.handleReaderLoad(event.target.result)
    }

    reader.readAsDataURL(file)

    event.preventDefault();
  }



  handleSubmit(event){
    event.preventDefault();
    this.setState({
      fileName: this.state.file.name + "-" + Date.now()
    }, () => {
      axios.post('/user/avatar', {fileName: this.state.file.name, fileType: this.state.file.type}).then(response => {
        axios.put(response.data.signedUrl, this.state.file).then(result => {
          var newUser = this.props.user;
          newUser.img = "https://s3.us-east-2.amazonaws.com/knows/" + this.state.file.name;
          this.props.updateUser({user: newUser});
          this.setState({displayModal: false})
        }).catch(err => {
          console.log(err)
          alert('Upload failed :(')
        })
      }).catch(err => {
        alert('Upload failed :(')
      })
    })
  }

  render() {
    return (
      <div className="AvatarForm">
        <form method='post' encType="multipart/form-data" onSubmit={this.handleSubmit.bind(this)}>
          <label htmlFor='av-in'><div className='btn btn-sm btn-secondary av-btn'><span className='icon icon-camera'></span></div></label>
          <input type='file' name='avatar' id='av-in' onChange={this.handleChange.bind(this)}/>
        </form>

        {this.state.displayModal &&
          <Modal
            close={this.closeModal.bind(this)}
            title='Choose Profile Picture:'
            body={<div><img className='av-selected mt-2' src={this.state.result}/><div className='mb-2 av-btns'><button className='btn btn-secondary mr-2' id='av-cancel'>Cancel</button><button id='av-post' className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>Post</button></div></div>}
          />
        }

      </div>

    );
  }
}

export default AvatarForm;
