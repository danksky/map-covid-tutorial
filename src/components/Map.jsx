import React from 'react';

import * as d3 from 'd3';
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"

const projection = geoMercator()
  .scale(100)
  .translate([400, 300])

const sampleData = {
  "Fiji": 3074,
  "Tanzania": 9138,
  "W. Sahara": 4143,
  "Canada": 9726,
  "United States of America": 2439,
  "Kazakhstan": 5090,
  "Uzbekistan": 7353,
  "Papua New Guinea": 6460,
  "Indonesia": 6747,
  "Argentina": 9,
  "Chile": 5864,
  "Dem. Rep. Congo": 6845,
  "Somalia": 192,
  "Kenya": 6651,
  "Sudan": 346,
  "Chad": 6251,
  "Haiti": 1143,
  "Dominican Rep.": 2436,
  "Russia": 4703,
  "Bahamas": 5904,
  "Falkland Is.": 3269,
  "Norway": 8617,
  "Greenland": 3984,
  "Fr. S. Antarctic Lands": 8599,
  "Timor-Leste": 6780,
  "South Africa": 4176,
  "Lesotho": 1642,
  "Mexico": 4020,
  "Uruguay": 8650,
  "Brazil": 2984,
  "Bolivia": 1736,
  "Peru": 2555,
  "Colombia": 4452,
  "Panama": 4131,
  "Costa Rica": 91,
  "Nicaragua": 7043,
  "Honduras": 6387,
  "El Salvador": 1059,
  "Guatemala": 3389,
  "Belize": 1865,
  "Venezuela": 7918,
  "Guyana": 9731,
  "Suriname": 7663,
  "France": 8582,
  "Ecuador": 1889,
  "Puerto Rico": 6067,
  "Jamaica": 5362,
  "Cuba": 6440,
  "Zimbabwe": 1816,
  "Botswana": 5960,
  "Namibia": 9102,
  "Senegal": 9869,
  "Mali": 2561,
  "Mauritania": 9969,
  "Benin": 6901,
  "Niger": 5985,
  "Nigeria": 4014,
  "Cameroon": 3428,
  "Togo": 4304,
  "Ghana": 8478,
  "Côte d'Ivoire": 1051,
  "Guinea": 5548,
  "Guinea-Bissau": 7992,
  "Liberia": 6675,
  "Sierra Leone": 4517,
  "Burkina Faso": 4694,
  "Central African Rep.": 1429,
  "Congo": 7581,
  "Gabon": 449,
  "Eq. Guinea": 4241,
  "Zambia": 3389,
  "Malawi": 5880,
};

function getCountryFill(featureElement) {
  let name = featureElement.properties.name;
  let value = sampleData[name];
  if (value) {
    let opacity = value / 10000;
    return `rgba(255, 0, 255, ${opacity})`;
  }
  return `rgba(200, 200, 200, 1)`;
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryShapes: null,
    };
  }

  componentDidMount() {
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(json => {
        this.setState({
          countryShapes: feature(json, json.objects.countries).features,
        })
        d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
          .then(csvData => {
            console.log(csvData);
            console.log(csvData[0]);
            console.log(csvData.columns);
          })
      })
  }

  render() {
    return (
      <div className="Map" >
        <svg width={1024} height={650} viewBox="0 0 1024 650">
          <g className="countries-group">
            {this.state.countryShapes ?
              this.state.countryShapes.map((featureElement, index) => (
                <path
                  key={`country-svg-${index}`}
                  d={geoPath().projection(projection)(featureElement)}
                  className="country"
                  fill={getCountryFill(featureElement)}
                  stroke="black"
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