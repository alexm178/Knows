import React, { Component } from 'react';
import Timeline from "./Timeline";
import ProjectTitle from "./ProjectTitle";
import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import ProjectColabs from "./ProjectColabs";
import PreviewProject from "./PreviewProject"

class ProjectForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      display: 5,
      title: "",
      description: "",
      stages: [''],
      tags: [],
      collaborators: [],
      optional: ""
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
      case 3:
        return(<ProjectTags harvestData={this.harvestData.bind(this)} tags={this.state.tags} />);
        break;
      case 4:
        return(<ProjectColabs harvestData={this.harvestData.bind(this)} collaborators={this.state.collaborators} />);
        break;
      case 5:
        return(<PreviewProject project={this.state} />);
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
        break;
      case "tags":
        this.setState({tags: data});
        break;
      case "collaborators":
        this.setState({collaborators: data})
    }
  }

  navigateForm(n) {
    this.setState({
      display: this.state.display + n
    }, () => {
      if (this.state.display > 1) {
        this.setState({
          optional: <em>optional</em>
        })
      } else {
        this.setState({
          optional: ""
        })
      }
    })
  }

  render() {
    return (
      <div className="project-form w-100">
        {this.getComponent(this.state.display)}
        <div className="project-nav w-100">
          <div onClick={() => {this.navigateForm(-1)}} className={"project-prev " + (this.state.display === 0 ? "hidden" : "auto")} style={{"color": "#5bc0de", "cursor" : "pointer"}}>
            <span className="icon icon-chevron-thin-left"  ></span>
             Previous
          </div>
          <div className="project-optional">
            {this.state.optional}
          </div>
          <div onClick={() => {this.navigateForm(1)}} className={"project-next " + (this.state.display === 5 ? "hidden" : "auto")} style={{"color": "#5bc0de", "cursor" : "pointer"}}>
          Next
            <span className="icon icon-chevron-thin-right"></span>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectForm;
