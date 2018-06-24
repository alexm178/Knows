import React, { Component } from 'react';



class ProjectDescription extends Component {
  constructor(props){
    super(props);
    this.state = {
      class: "project-description-input"
    }
  }

  handleChange(event) {
    this.props.harvestData("description", event.target.value)
  }


  render() {
    return (
      <textarea ref={(input) => {this.input = input}} onChange={this.handleChange.bind(this)} className={"w-100 " + (this.props.description === "" ? "project-description-input" : "description-populated")} value={this.props.description} placeholder="Description"/>
    );
  }
}

export default ProjectDescription;
