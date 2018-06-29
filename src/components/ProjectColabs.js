import React, { Component } from 'react';
import axios from "axios"


class ProjectTags extends Component {
  constructor(props){
    super(props);
    this.state = {
      collaborators: [],
      selected: 0,
      users: [],
    }
  }

  incrementSelected(n) {
    var selected = this.state.selected + n;
    var users = this.state.users
    this.setState({
      selected: selected,
    }, () => {
      this.refs[this.state.selected].scrollIntoView({block: 'end', behavior: 'smooth'})
    })
  }

  changeSelected(index) {
    this.setState({
      selected: index
    })
  }

  handleChange(event) {
    if (event.keyCode === 40) {
      if (this.state.selected !== this.state.users.length - 1) {
        this.incrementSelected(1)
      }
    } else if (event.keyCode === 38 ){
      if (this.state.selected !== 0) {
        this.incrementSelected(-1)
      }
    } else if (event.keyCode === 13 && this.state.users.length > 0){
      this.pushCollabs();
      this.setState({
        users: []
      })
    } else if (event.target.value.length < 4) {
      this.setState({
        users: []
      })
    } else {
      axios.get("/user/following?terms=" + event.target.value).then(
        response => {
        if (this.input.value !== "") {
            this.setState({
              users: response.data,
            })
          }
        }
      ).catch(
        err => {
          alert("Something went wrong")
        }
      )
    }
  }

  pushCollabs() {
    var collaborators = this.props.collaborators
    var selected = this.refs[this.state.selected];
    var user = {
      firstName: selected.attributes.firstname.value,
      lastName: selected.attributes.lastName.value,
      img: selected.attributes.img.value
    }
    collaborators.push(user);
    this.props.harvestData("collaborators", collaborators);
    this.input.value = ""
    this.setState({
      users: []
    })
  }

  removeCollab(index) {
    var collabs = this.props.collaborators;
    collabs.splice(index, 1);
    this.props.harvestData("collaborators", collabs)
  }



  render() {
    return (
      <div className="w-100">
        <div className="tags-info pl-2">
          <h3 className="d-inline float-left">Collaborators:</h3>
          <span className="float-right pt-2 collab-info">
            <em>Collaborators must be people you follow</em>
          </span>
        </div>
        <div className="tags-display w-100 text-center p-2"
          style={{"height": (this.props.collaborators.length === 0 ? "50px" : "auto") }}
        >
          {this.props.collaborators.map((user, i) => {
            return(
              <div key={i} className="collab">
                <div onClick={() => {this.removeCollab(i)}} className="collab-cancel"><span className="collab-cancel-x">x</span></div>
                <div
                  onClick={() => {this.removeTag(i)}}
                  className="collab-av"
                  style={{
                    "backgroundImage": "url(" + user.img + ")",
                    "backgroundSize" : "cover",
                    "backgroundPosition": "center center"
                  }}></div>
                <div className="pl-1 pr-1 collab-name">{user.firstName + " " + user.lastName}</div>
              </div>
            )
          })}
        </div>
        <div className="collabs-action position-relative">
          <input ref={(input) => {this.input = input}} onKeyUp={this.handleChange.bind(this)} className="collabs-input" placeholder="New Collaborator"/>

          <div className="found-collabs">
            <ul className="media-list media-list-users list-group">
              {this.state.users.map((user, i) => {
                return(
                  <li
                    key={i}
                    ref={i}
                    img={user.img}
                    firstname= {user.firstName}
                    lastname= {user.lastName}
                    onClick={() => {this.changeSelected(i)}}
                    className={"list-group-item " + (this.state.selected === i ? "collab-search-user-selected" : "collab-search-user" )}
                  >
                    <div className="media w-100">
                      <div className="media-object d-flex align-self-start mr-3 collab-search-av" style={{"backgroundImage": "url(" + user.img + ")", "backgroundSize": "cover", "backgroundPosition": "center center"}}></div>
                      <div className="media-body collab-search-name">
                        <strong>{user.firstName + " " + user.lastName}</strong>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectTags;
