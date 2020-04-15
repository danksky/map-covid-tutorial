import React from 'react';

import * as d3 from 'd3';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(json => {
        console.log(json);
      })
  }

  render() {
    return (
      <div className="Map" >
        MAPONENT
      </div>
    );
  }
}
