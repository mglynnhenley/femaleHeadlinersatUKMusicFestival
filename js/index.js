import { display } from "./sections.js"
import { loadAndProcessData } from "./processData/loadAndProcessData.js";
import { colourLegend } from "./legend.js";

let data;
let geoData;
let colourScheme
let artistData;
let artistShown = [];

const updateVis = () => {
  const colourScheme = ['#d01c8b', '#f1b6da', '#4dac26']

  // TODO: you should pass the svg into display from index.js
  let rightDiv = d3.selectAll('#right')
  const legendSvg = d3.selectAll('#legend-histogram')
  const legendSummary = d3.selectAll('#legend-summary')
  const legendAnnotate = d3.selectAll('#legend-annotate')

  // call the legend function
  legendSvg.call(colourLegend, {
    legendType: 'rect',
    colourScale: colourScheme,
    keys: ['female', 'mixed', 'other'],
    circleRadius: 4,
    spacing: 10,
    textOffset: 4,
    borderWeightScale:  ['1','2','3']
  })

  legendSummary.call(colourLegend, {
    legendType: 'circle',
    colourScale: colourScheme,
    keys: ['female', 'mixed',  'other'],
    circleRadius: 4,
    spacing: 10,
    textOffset: 4,
    borderWeightScale: ['3','2','1']
  })

  legendAnnotate.call(colourLegend, {
    legendType: 'circle',
    colourScale: colourScheme,
    keys: ['female', 'mixed'],
    circleRadius: 4,
    spacing: 10,
    textOffset: 4,
    borderWeightScale: ['3','1']
  })

  // Initialize the recording of artist information class
  const artistInfoClass = new artistInfo(rightDiv, {
    data: data,
    margin: { top: 10, bottom: 10, left: 10, right: 10},
    artists: [],
    colorScheme: colourScheme,
  })
  artistInfoClass.initVis();
  
  // function that shows the artist information on click on the object
  const onClick = (d) => {
    if (artistShown.length > 4) {
      artistShown = artistShown.slice(1);
    }
    if (artistShown.includes(d)){
      const index = artistShown.indexOf(d);
      artistShown.splice(index, 1);
    } else {
      artistShown.push(d);
    }
    artistInfoClass.props.artists = artistShown;
    artistInfoClass.updateVis();
  }
  display(data, colourScheme, onClick)

}

// load data and display
loadAndProcessData().then(([loadedData]) => {
  data = loadedData
  updateVis()
})
