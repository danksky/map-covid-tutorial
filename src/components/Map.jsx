import React from 'react';

import * as d3 from 'd3';
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"

const projection = geoMercator()
  .scale(100)
  .translate([400, 300])

function getCountryFill(referenceData, featureElement, maxCount) {
  let name = featureElement.properties.name;
  let value = referenceData[name];
  if (value) {
    let opacity = value / maxCount;
    return `rgba(255, 0, 255, ${opacity})`;
  }
  return `rgba(200, 200, 200, 1)`;
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryShapes: null,
      countryDataset: null,
      caseCountMax: null,
    };
  }

  async componentDidMount() {
    var countryShapes = null;
    var countryDataset = null;
    await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(async (json) => {
        countryShapes = feature(json, json.objects.countries).features;
        await d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
          .then(csvData => {
            countryDataset = {};
            let latestDate = csvData.columns[csvData.columns.length - 1];
            csvData.forEach(province => {
              let countryName = province["Country/Region"];
              let caseCount = province[latestDate];
              if (countryDataset[countryName] === undefined) {
                countryDataset[countryName] = Number.parseInt(caseCount);
              } else {
                countryDataset[countryName] += Number.parseInt(caseCount);
              }
            })
          });
      });

    // Left: the name of the country as indicated in the TopoJSON
    // Right: the name of the country as indicated in the JHU CSSE case data
    countryDataset["United States of America"] = countryDataset["US"];
    countryDataset["Greenland"] = countryDataset["Denmark"];
    countryDataset["Congo"] = countryDataset["Congo (Brazzaville)"];
    countryDataset["Dem. Rep. Congo"] = countryDataset["Congo (Kinshasa)"];
    countryDataset["Central African Rep."] = countryDataset["Central African Republic"];
    countryDataset["S. Sudan"] = countryDataset["South Sudan"];
    countryDataset["Côte d'Ivoire"] = countryDataset["Cote d'Ivoire"];
    countryDataset["Myanmar"] = countryDataset["Burma"];
    countryDataset["South Korea"] = countryDataset["Korea, South"];

    var caseCountMax = Math.max(...Object.values(countryDataset).map(value => value));

    this.setState({
      countryShapes: countryShapes,
      countryDataset: countryDataset,
      caseCountMax: caseCountMax,
    });
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
                  fill={getCountryFill(this.state.countryDataset, featureElement, this.state.caseCountMax)}
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