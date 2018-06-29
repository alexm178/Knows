import React, { Component } from 'react';




class Timeline extends Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      titles: this.props.titles,
      selected: 0
    }
  }

  changeSelected(n) {
    this.setState({
      selected: n
    })
    this.input.focus()
  }



  handleTitleChange(event) {
    var titles = this.state.titles;
    titles[this.state.selected] = event.target.value;
    this.setState({
      titles: titles
    }, () => {
      this.props.harvestData("timeline", this.state.titles)
    })
  }

  incrementTimeline(event) {
    var titles = this.state.titles;
    titles.push('');
    this.setState({
      titles: titles,
      selected: this.state.titles.length -1
    })
    this.input.focus();
  }

  incrementSelected(n) {
    var selected = this.state.selected;
    selected += n;
    this.setState({selected: selected})
    this.input.focus();
  }

  mapTimelineItems() {
    var items = this.state.titles.map((item, i) => {
      return (
        <div key={i} className="timeline-item" style={{"width" : 100 / (this.state.titles.length + 2) + "%"}}>
          <div onMouseEnter={() => {this.changeSelected(i)}} onClick={() => {this.changeSelected(i)}} className={"timeline-ball" + (this.state.selected === i ? "-selected" : "")}>
            <p className={"timeline-ball-text" + (this.state.selected === i ? "-selected" : "")}>{i + 1}</p>
          </div>
        </div>
      )
    })
    return items
  }




  render() {
    return (
          <div className="w-100 p-2">
            <div className="w-100">
              <h3 className="d-inline" >Timeline</h3>
              <h3 className="d-inline select-indicator">Step {this.state.selected + 1}</h3>
            </div>
            <div className="d-block timeline">
              <div className="timeline-item" style={{"width" : 100 / (this.state.titles.length + 2) + "%"}}>
                <div className="timeline-ball-left">
                  <div className="inner-ball">
                    <span className="icon icon-controller-play"></span>
                  </div>
                </div>
              </div>

              {this.mapTimelineItems()}

              <div className="timeline-item" style={{"width" : 100 / (this.state.titles.length + 2) + "%"}}>
                <div className="timeline-ball-right">
                  <div className="inner-ball">
                  <span className="icon icon-check"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="timeline-form">

              <div className="title-select">



                <input ref={(input) => {this.input = input}} onChange={(event) => {this.handleTitleChange(event)}} className="timeline-input" type="text" value={this.state.titles[this.state.selected]} placeholder="Title" />

              </div>

                <span onClick={() => {this.incrementSelected(-1)}} className={"icon icon-chevron-thin-left mr-2 " + (this.state.selected === 0 ? "hidden" : null)}></span>


              <button onClick={this.incrementTimeline.bind(this)} className="btn btn-primary btn-md">Add Another Step</button>

                <span onClick={() => {this.incrementSelected(1)}} className={"icon icon-chevron-thin-right ml-2 " + (this.state.selected === this.state.titles.length - 1 ? "hidden" : null)}></span>

            </div>
          </div>
    );
  }
}

export default Timeline;
