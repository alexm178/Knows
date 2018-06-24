import React, { Component } from 'react';



class ProjectTitle extends Component {
  constructor(props){
    super(props);
  }

  handleChange(event) {
    this.props.harvestData("title", event.target.value)
  }

  render() {
    return (
      <textarea onChange={this.handleChange.bind(this)}className="w-100 project-title-input pt-5 text-center" value={this.props.title} placeholder="Project Title"/>
    );
  }
}

export default ProjectTitle;
