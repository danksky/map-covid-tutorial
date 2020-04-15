import React from 'react';

import * as d3 from 'd3';
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"

const projection = geoMercator()
  .scale(100)
  .translate([400, 300])

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: null,
    };
  }

  componentDidMount() {
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(json => {
        this.setState({
          countries: feature(json, json.objects.countries).features,
        })
      })
  }

  render() {
    return (
      <div className="Map" >
        <svg width={1024} height={650} viewBox="0 0 1024 650">
          <g className="countries-group">
            {this.state.countries ?
              this.state.countries.map((featureElement, index) => (
                <path
                  key={`country-svg-${index}`}
                  d={geoPath().projection(projection)(featureElement)}
                  className="country"
                  fill={`rgba(140,0,140,1)`}
                  stroke="#FFFFFF"
                  strokeWidth={0.25}
                />
              )) : null
            }
          </g>
        </svg>
      </div>
    );
  }
}