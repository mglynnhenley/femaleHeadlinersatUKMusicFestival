
const { x, y, width, height } = d3
  .selectAll('#graphic')
  .node()
  .getBoundingClientRect()

let data
let colourScheme
let circlesView
let histogramView

const scrollVis = (onClick, onHoverOn, onHoverOff, formatID) => {
  var margin = { top: 10, left: 10, bottom: 10, right: 10 }
  var lastIndex = -1
  var activeIndex = 0
  var svg = null

  var activateFunctions = []
  var updateFunctions = []

  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([data])
      var svgE = svg.enter().append('svg')
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE)
      svg
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      setupVis()
      setupSections()
    })
  }

  const setupVis = () => {

    // initialize the circles views
    circlesView = new circles(svg, {
      data,
      margin: { top: 40, bottom: 10, left: 40, right: 10 },
      onClick: onClick,
      colorScheme: colourScheme,
      onHoverOn: onHoverOn,
      onHoverOff: onHoverOff,
      formatID: formatID,
    })

    // initialize the histogram views
    histogramView = new histogram(svg, {
      data: data.filter(d => d.year >= 2007),
      margin: { top: 40, bottom: 30, left:200, right:20 },
      xAxisLabel: 'UK Festival',
      yAxisLabel: 'Number of Headlining Acts' ,
      onClick: onClick,
      colorScheme: colourScheme,
      onHoverOn: onHoverOn,
      onHoverOff: onHoverOff,
      formatID: formatID,
    })
  }

  // on scroll through each view the activate function will be called in order
  var setupSections = function () {
    activateFunctions[0] = showTitle
    activateFunctions[1] = showHistogram
    activateFunctions[2] = showSummary
    activateFunctions[3] = filterCircles
    for (var i = 0; i < 4; i++) {
      updateFunctions[i] = function () {}
    }
  }

  function showTitle () {
    // On scroll back up to title, we want to hide the histogram view
    svg.selectAll('.histogram').transition().duration(1000).attr('display', 'none')
  }

  function showSummary () {
    // Show the circle elements, hide the histogram view
    svg.selectAll('circle').transition('add_circles').attr('display', 'inline-block')
    svg.selectAll('.histogram').transition('hide_histo').duration(1000).attr('display', 'none')
    // update the circle class with all the data for the summary screen
    circlesView.props.data = data
    circlesView.updateVis()
  }

  function filterCircles () {
    // update the circle class with just the data for female and mixed headliners
    circlesView.props.data = data.filter(d => d.gender == 'f' | d.gender == 'mixed')
    circlesView.updateVis()
  }

  const showHistogram = () => {
    // hide the circles and then show the histogram
    svg.selectAll('circle').transition('hide_circles').attr('display', 'none')
    histogramView.updateVis();
    }

  chart.activate = function (index) {
    activeIndex = index
    var sign = activeIndex - lastIndex < 0 ? -1 : 1
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign)
    scrolledSections.forEach(function (i) {
      activateFunctions[i]()
    })
    lastIndex = activeIndex
  }

  return chart
}

// external function to be called by index
export const display = (dataArgument, colours, onClick, onHoverOn, onHoverOff, formatID) => {
  data = dataArgument
  colourScheme = colours
  
  // initiate scroller function
  var plot = scrollVis(onClick, onHoverOn, onHoverOff, formatID)
  d3.select('#vis').datum(data).call(plot, { data: data })

  // initialize scroller component on graphic section
  var scroll = scroller().container(d3.select('#graphic'))

  scroll(d3.selectAll('.step'))

  // define what happens when a scroll event is detected
  scroll.on('active', function (index) {
    plot.activate(index)
    d3.selectAll('.step')
    .transition().duration(1000)
    .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });
  })


}
