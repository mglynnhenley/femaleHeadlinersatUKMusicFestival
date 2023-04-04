import { display } from "./sections.js"
import { loadAndProcessData } from "./processData/loadAndProcessData.js";
import { colourLegend } from "./legend.js";

let data;
let geoData;
let artistData;
let artistShown = [];

const updateVis = () => {
  const colorScheme = ['#d01c8b', '#f1b6da', '#4dac26']

  // TODO: you should pass the svg into display from index.js
  let rightDiv = d3.selectAll('#right')
  const legendSvg = d3.selectAll('#legend-histogram')
  const legendSummary = d3.selectAll('#legend-summary')
  const legendAnnotate = d3.selectAll('#legend-annotate')

  legendSvg.call(colourLegend, {
    legendType: 'rect',
    colourScale: colorScheme,
    keys: ['female', 'mixed', 'other'],
    circleRadius: 4,
    spacing: 10,
    textOffset: 4,
    borderWeightScale:  ['1','2','3']
  })

  legendSummary.call(colourLegend, {
    legendType: 'circle',
    colourScale: colorScheme,
    keys: ['female', 'mixed',  'other'],
    circleRadius: 4,
    spacing: 10,
    textOffset: 4,
    borderWeightScale: ['3','2','1']
  })

  legendAnnotate.call(colourLegend, {
    legendType: 'circle',
    colourScale: colorScheme,
    keys: ['female', 'mixed'],
    circleRadius: 4,
    spacing: 10,
    textOffset: 4,
    borderWeightScale: ['3','1']
  })

  const artistInfoClass = new artistInfo(rightDiv, {
    data: data,
    margin: { top: 10, bottom: 10, left: 10, right: 10},
    artists: [],
    colorScheme: colorScheme,
  })
  artistInfoClass.initVis();
  
  const onClick = (d) => {
    console.log(d)
    if (artistShown.includes(d)){
      const index = artistShown.indexOf(d);
      artistShown.splice(index, 1);
    } else {
      artistShown.push(d);
    }
    artistInfoClass.props.artists = artistShown;
    artistInfoClass.updateVis();
  }
  display(data, onClick)

}

// load data and display
loadAndProcessData().then(([loadedData, loadedGeoData, loadedArtistData]) => {
  data = loadedData
  geoData = loadedGeoData
  artistData = loadedArtistData
  updateVis()
})
