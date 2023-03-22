import { display } from "./sections.js"
import { loadAndProcessData } from "./processData/loadAndProcessData.js";

let data;

const updateVis = () => {

  let svg = d3.selectAll('svg.right')

  console.log(svg)

  // svg.call(tree, {
  //   data: data,
  //   margin: { top: 10, bottom: 500, left: 10, right: 40},
  // })

  const treeClassVariable = new treeClass(svg, {
    data,
    margin: { top: 10, bottom: 300, left: 10, right: 40},
    index: 1
  });

  const onScroll = (index) => {
    treeClassVariable.props.index = index;
    treeClassVariable.updateVis();
  }

  treeClassVariable.initVis();

  display(data, onScroll)

}

// load data and display
loadAndProcessData().then(loadedData => {
  data = loadedData
  updateVis()
})
