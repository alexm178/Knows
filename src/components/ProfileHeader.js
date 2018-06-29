import React, { Component } from 'react';
import AvatarForm from './avatar-form';
import FollowButton from './FollowButton';
import Modal from "./modal";
import axios from "axios"


class ProfileHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: null,
      result: null,
      displayModal: false,
      img: "",
      cover: "",
      which: ""
    }
  }



  handleReaderLoad(result) {
    this.setState({
      result: result,
      displayModal: true,
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
    this.setState({
      file: file,
      displayModal: true
    })

    reader.onloadend = (event) => {
      this.setState({
        result: event.target.result
      })
    }

    reader.readAsDataURL(file)

    event.preventDefault();
  }



  handleSubmit(event){
    event.preventDefault();
    this.setState({
      displayModal: false
    }, () => {
      axios.post('/user/photo?which=' + this.state.which, {fileName: this.state.file.name + "-" + Date.now(), fileType: this.state.file.type}).then(response => {
        axios.put(response.data.signedUrl, this.state.file).then(result => {
          var url = "http://d2nyad70j27i0j.cloudfront.net/" + this.state.file.name;
          if (this.state.which === "avatar") {
            this.setState({img: url})
          } else {
            this.setState({cover: url})
          }
        }).catch(err => {
          console.log(err)
          alert('Upload failed :(')
        })
      }).catch(err => {
        alert('Upload failed :(')
      })
    })
  }

  componentWillMount() {
    this.setState({
      img: this.props.profile.img,
      cover: this.props.profile.cover
    })
  }

  render() {
    return (
      <div className="profile-header" style={{backgroundImage: 'url(' + this.state.cover + ')', backgroundSize: "cover", backgroundPosition: "center center"}}>
        <div className="container">

          {this.props.profile._id === this.props.user._id &&
            <div className="edit-cover" onClick={() => {this.setState({which: "cover"})}}>
              <label htmlFor='cover-input'>Cover <span className="icon icon-camera"></span></label>
              <input className="d-none" type='file' id="cover-input" name='avatar' onChange={this.handleChange.bind(this)}/>
            </div>
          }

          <div className="container-inner">

              <div
                className="rounded-circle media-object profile-avatar"
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                  backgroundImage: 'url(' + this.state.img + ')'
                }}>

              {this.props.profile._id === this.props.user._id &&
                <div className="edit-avatar" onClick={() => {this.setState({which: "avatar"})}}>
                  <label htmlFor='avatar-input'><span className="icon icon-camera"></span></label>
                  <input className="d-none" type='file' id="avatar-input" name='cover' onChange={this.handleChange.bind(this)}/>
                </div>
              }


            </div>
            <h3 className="profile-header-user">{this.props.profile.firstName + ' ' + this.props.profile.lastName}</h3>
            <p className="profile-header-bio">
            {this.props.profile.bio}
            </p>
          </div>
          <FollowButton isProfile={true} user={this.props.user} id={this.props.profile._id} isFollowing={this.props.user.following.some(follow => {return follow === this.props.profile._id})} emit={this.props.emit.bind(this)}/>

        </div>



        <nav className="profile-header-nav">
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item active">
              <a className="nav-link collection" id="feed" href="feed">Feed</a>
            </li>
            <li className="nav-item">
              <a className="nav-link collection" id="projects" href="projects">Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link collection" id="photos" href="photos">Photos</a>
            </li>
          </ul>
        </nav>

        {this.state.displayModal &&
          <Modal
            close={this.closeModal.bind(this)}
            title='Choose Profile Picture:'
            body={<div><img className='av-selected mt-2' src={this.state.result} alt="Chosen Avatar"/><div className='mb-2 av-btns'><button className='btn btn-secondary mr-2' id='av-cancel'>Cancel</button><button id='av-post' className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>Post</button></div></div>}
          />
        }

      </div>

    );
  }
}

export default ProfileHeader;
