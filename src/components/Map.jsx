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
      countries: null, // 1
    };
  }

  componentDidMount() {
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(json => {
        this.setState({ // 4
          countries: feature(json, json.objects.countries).features,
        })
      })
  }

  render() {
    return (
      <div className="Map" >
        <svg width={1024} height={650} viewBox="0 0 1024 650"> {/* 2 */}
          <g className="countries">
            {this.state.countries ? // 3
              this.state.countries.map((featureElement, index) => ( // 5
                <path
                  key={`country-svg-${index}`}
                  d={geoPath().projection(projection)(featureElement)} // 6
                  className="country"
                  fill={`rgba(140,0,140,1)`} // 7
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
