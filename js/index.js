import { display } from "./sections.js"
import { loadAndProcessData } from "./processData/loadAndProcessData.js";

let data;
let artistShown = [];

const updateVis = () => {

  let svg = d3.selectAll('svg.right')
  let svgLeftLeft = d3.selectAll('svg.leftleft')

  const artistInfoClass = new artistInfo(svgLeftLeft, {
    data,
    margin: { top: 0, bottom: 0, left: 0, right: 0},
    artists: []
  })
  artistInfoClass.initVis();

  const treeClassVariable = new treeClass(svg, {
    data,
    margin: { top: 10, bottom: 300, left: 10, right: 40},
    index: 1,
    artists: []
  });

  const onScroll = (index) => {
    treeClassVariable.props.index = index;
    treeClassVariable.updateVis();
  }

  const onClick = (event, d) => {
    event.target.style.fill = 'orange';
    artistShown.push(d[0]);
    artistInfoClass.props.artists = artistShown;
    treeClassVariable.props.artists = artistShown;
    treeClassVariable.updateVis();
    artistInfoClass.updateVis();
  }

  treeClassVariable.initVis();

  display(data, onScroll, onClick)

}

// load data and display
loadAndProcessData().then(loadedData => {
  data = loadedData
  updateVis()
})
