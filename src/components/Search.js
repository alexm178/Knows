import React, { Component } from 'react';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
  }

  componentWillMount() {
    var results = this.props.results.map(result => {
      return (
        <li key={result._id}><a href={"/profile/" + result._id}>{result.firstName + result.lastName}</a></li>
      )
    })
    this.setState({results: results})
  }

  render() {
    return (
      <ul>{this.state.results}</ul>
    );
  }
}

export default Search;
