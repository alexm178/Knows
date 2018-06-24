import React, { Component } from 'react';
import Timeline from "./Timeline";
import ProjectTitle from "./ProjectTitle";
import ProjectDescription from "./ProjectDescription";

class ProjectForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      display: 0,
      title: "",
      description: "",
      stages: ['']
    }
  }

  getComponent(which) {
    switch (which) {
      case 0:
        return(<ProjectTitle harvestData={this.harvestData.bind(this)} title={this.state.title}/>)
        break;
      case 1:
        return (<ProjectDescription harvestData={this.harvestData.bind(this)} description={this.state.description} />);
        break;
      case 2:
        return(<Timeline harvestData={this.harvestData.bind(this)} titles={this.state.stages}/>)
        break;

    }
  }

  harvestData(which, data) {
    switch (which) {
      case "timeline":
        this.setState({stages: data});
        break;
      case "title":
        this.setState({title: data})
        break;
      case "description":
        this.setState({description: data});
        break
    }
  }

  navigateForm(n) {
    this.setState({
      display: this.state.display + n
    })
  }

  render() {
    return (
      <div className="project-form w-100">
        {this.getComponent(this.state.display)}
        <div className="project-nav w-100">
          <div onClick={() => {this.navigateForm(-1)}} className={"d-inline float-left pl-2 pb-2 " + (this.state.display === 0 ? "hidden" : null)} style={{"color": "#5bc0de"}}>
            <span className="icon icon-chevron-thin-left"></span>
             Previous
          </div>
          <div onClick={() => {this.navigateForm(1)}} className={"d-inline float-right pr-2 pb-2 " + (this.state.display === 6 ? "hidden" : null)} style={{"color": "#5bc0de"}}>
          Next
            <span className="icon icon-chevron-thin-right"></span>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectForm;
