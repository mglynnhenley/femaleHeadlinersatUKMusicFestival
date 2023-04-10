import { display } from "./sections.js"
import { loadAndProcessData } from "./processData/loadAndProcessData.js";
import { colourLegend } from "./legend.js";

let rightDiv = d3.selectAll('#right')
let legendSvg = d3.selectAll('#legend-histogram')
let legendSummary = d3.selectAll('#legend-summary')
let legendAnnotate = d3.selectAll('#legend-annotate')

// Global/State variables
let data;
let artistShown = [];
const colours = ['#d01c8b', '#f1b6da', '#4dac26'] // dark pink, light pink and green 
const genderOfHeadliners = ['female', 'mixed', 'other']

// Colour scale (shared between views)
const colourScale = d3
  .scaleOrdinal()
  .domain(genderOfHeadliners)
  .range(colours);

const formatID = (x) => {
    return x.toUpperCase().split(' ').join('_').split('.').join('')
}

const onHoverOn = (d) => {
  console.log('onHoverOn')
  d3.selectAll('#' + formatID(d)).style('fill', 'white').style('stroke', '#C0C0BB');
}

const onHoverOff = (d, gender) => {
  d3.selectAll('#' + formatID(d)).style('fill', colourScale(gender)).style('stroke', 'white');
}

const updateVis = () => {

// legend for the first view
  legendSvg.call(colourLegend, {
    legendType: 'rect',
    colourScale: colourScale,
    keys: ['female', 'mixed', 'other'],
  })

// legend for the second view
  legendSummary.call(colourLegend, {
    legendType: 'circle',
    colourScale: colourScale,
    keys: ['female', 'mixed',  'other']
  })

// legend for the third view
  legendAnnotate.call(colourLegend, {
    legendType: 'circle',
    colourScale: colourScale,
    keys: ['female', 'mixed']
  })

  // Initialize the recording of artist information class
  const artistInfoClass = new artistInfo(rightDiv, {
    data: data,
    margin: { top: 10, bottom: 10, left: 10, right: 10},
    artists: [],
    colourScale: colourScale,
    onHoverOn: onHoverOn,
    onHoverOff: onHoverOff,
  })
  artistInfoClass.initVis();
  
  
  const onClick = (d) => {
    if (artistShown.length > 4) {
      artistShown = artistShown.slice(1); // If length is greater than 4, remove last artist
    }
    if (artistShown.includes(d)){
      const index = artistShown.indexOf(d);
      artistShown.splice(index, 1);  // If element already selected, remove artist from array 
    } else {
      artistShown.push(d); // Otherwise add artist
    }
    artistInfoClass.props.artists = artistShown; 
    artistInfoClass.updateVis(); // update artist info visualisation with new/removed artists
  }


  display(data, colours, onClick, onHoverOn, onHoverOff, formatID)
}

// Data loading, preprocessing, and init visualisation
loadAndProcessData().then(([loadedData]) => {
  data = loadedData
  updateVis()
})
