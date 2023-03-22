import { histogram } from './histogram.js'
import { loadAndProcessData } from './processData/loadAndProcessData.js'
import { tree } from './tree.js'
import { circles } from './circles.js'
import { circlesGroupedByFestival } from './circlesGroupedByFestival.js'

const { x, y, width, height } = d3
  .selectAll('.left')
  .node()
  .getBoundingClientRect()

  console.log(x,y)

let data

const scrollVis = () => {
  // constants to define the size
  // and margins of the vis area.
  var margin = { top: 0, left: 0, bottom: 0, right: 0}

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1
  var activeIndex = 0

  // main svg used for visualization
  var svg = null

  // d3 selection that will be used
  // for displaying visualizations
  var g = null

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = []
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = []

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([data])
      var svgE = svg.enter().append('svg')

      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE)

      svg.attr('width', width + margin.left + margin.right)
      svg.attr('height', height + margin.top + margin.bottom)


      setupVis()
      setupSections()
    })
  }

  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   */
  const setupVis = () => {
    svg.call(histogram, {
      data: data,
      margin: { top: 10, bottom: 150, left: 50, right: 50 },
      id: 'histogram'
    })

    svg.call(histogram, {
      data: data.filter(d => d.festival == 'Latitude'),
      margin: { top: 10, bottom: 150, left: 50, right: 50 },
      id: 'latitude'
    })
  }

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showLatitude
    activateFunctions[1] = showHistogram
    activateFunctions[2] = showTitle
    activateFunctions[3] = showCirclesGroupedByFestival

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 5; i++) {
      updateFunctions[i] = function () {}
    }
  }

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  function showTitle () {
    svg.selectAll('#histogram').transition(0).duration(600).attr('opacity', 1)

    svg.selectAll('#latitude').transition(600).duration(600).attr('opacity', 0)

    svg.selectAll('#circles').transition(600).duration(600).attr('opacity', 0)
  }

  function showHistogram () {
    svg.selectAll('#circles').transition(600).duration(600).attr('opacity', 0)

    svg.selectAll('#latitude').transition(0).duration(600).attr('opacity', 1)

    svg.selectAll('#histogram').transition(600).duration(600).attr('opacity', 0)
  }

  function showLatitude () {
    svg.selectAll('#latitude').transition(600).duration(600).attr('opacity', 0)

    svg.selectAll('#histogram').transition(600).duration(600).attr('opacity', 0)

    svg.call(circles, {
      data: data,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    })
  }

  const showCirclesGroupedByFestival = () => {
    svg.selectAll('#latitude').transition(600).duration(600).attr('opacity', 0)

    svg.selectAll('#histogram').transition(600).duration(600).attr('opacity', 0)

    svg.call(circlesGroupedByFestival, {
      data: data,
      margin: { top: 100, bottom: 100, left: 100, right: 100 }
    })
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index
    var sign = activeIndex - lastIndex < 0 ? -1 : 1
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign)
    scrolledSections.forEach(function (i) {
      activateFunctions[i]()
    })
    lastIndex = activeIndex
  }

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress)
  }
  // return chart function

  return chart
}

/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
export const display = data => {
  // create a new plot and
  // display it
  var plot = scrollVis()
  d3.select('#vis').datum(data).call(plot)

  // setup scroll functionality
  var scroll = scroller().container(d3.select('#graphic'))

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'))

  // setup event handling
  scroll.on('active', function (index) {
    // activate current section
    plot.activate(index)
  })

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress)
  })
}

const updateVis = () => {

  const svg = d3.select('svg.right')
 
  svg.call(tree, {
    data: data,
    margin: { top: height-300, bottom: 0, left: width , right: 30 },
  })

  display(data)

}

// load data and display
loadAndProcessData().then(loadedData => {
  data = loadedData
  updateVis()
})
