import React, { Component } from 'react';



class ProjectTags extends Component {
  constructor(props){
    super(props);
    this.state = {
      tags: []
    }
  }

  handleChange(event) {
    if (event.keyCode === 13) {
      this.pushTags()
    }
  }

  pushTags() {
    var tags = this.props.tags
    tags.push(this.input.value);
    this.props.harvestData("tags", tags);
    this.input.value = ""
  }

  removeTag(index) {
    var tags = this.props.tags;
    tags.splice(index, 1);
    this.props.harvestData("tags", tags)
  }

  componentWillReceiveProps() {
    var tags = this.props.tags.map((tag, i) => {
      return (
        <div key={i} className="tag">
          <div onClick={() => {this.removeTag(i)}} className="tag-cancel d-inline">x</div>
          <div className="pl-1 pr-1 d-inline">{tag}</div>
        </div>
      )
    })
    this.setState({tags: tags})
  }


  render() {
    return (
      <div className="w-100">
        <div className="tags-info pl-2"><em>Tags help others find your project <span>(art, cars, etc.)</span></em></div>
        <div
          className="tags-display w-100 text-center p-2"
          style={{"height": (this.state.tags.length === 0 ? "50px" : "auto") }}
        >
          {this.state.tags}
        </div>
        <div className="tags-action position-relative">
          <input ref={(input) => {this.input = input}} onKeyUp={this.handleChange.bind(this)} className="tags-input" placeholder="New Tag"/>
          <span onClick={() => {this.pushTags()}}className="icon icon-plus add-tag"></span>
        </div>
      </div>
    );
  }
}

export default ProjectTags;
