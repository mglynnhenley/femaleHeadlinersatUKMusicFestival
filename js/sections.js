import { histogram } from './histogram.js';

const { x, y, width, height } = d3
  .selectAll('#graphic')
  .node()
  .getBoundingClientRect();

let data;
let circlesClassVariable;
let mapOfEnglandVariable;

const scrollVis = (onClick) => {
  var margin = { top: 10, left: 10, bottom: 10, right: 10 };
  var lastIndex = -1;
  var activeIndex = 0;
  var svg = null;
  var g = null;

  var activateFunctions = [];
  var updateFunctions = [];

  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([data]);
      var svgE = svg.enter().append('svg');

      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);
      svg.attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      setupVis();
      setupSections();
    });
  };

  const setupVis = () => {
    svg.call(histogram, {
      data: data,
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
      id: 'histogram',
    });

    svg.call(histogram, {
      data: data.filter((d) => d.festival == 'Latitude'),
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
      id: 'latitude',
    });

    mapOfEnglandVariable = new mapOfEngland(svg, {
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
    })

    circlesClassVariable = new circle(svg, {
      data,
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
      displayType: 'allCircles',
      onClick: onClick,
    });

  };

  var setupSections = function () {
    activateFunctions[0] = showCirclez;
    activateFunctions[1] = showCirclesGroupedByFestival;
    activateFunctions[2] = showTitle;
    activateFunctions[3] = showHistogram;

    for (var i = 0; i < 5; i++) {
      updateFunctions[i] = function () { };
    }
  };

  function showTitle() {
    svg
      .selectAll('#histogram')
      .transition(0)
      .duration(600)
      .attr('opacity', 1);

    svg
      .selectAll('#latitude')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);

    svg
      .selectAll('#circles')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);

  }

  function showHistogram() {
    svg
      .selectAll('#circles')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);

    svg
      .selectAll('#latitude')
      .transition(0)
      .duration(600)
      .attr('opacity', 1);

    svg
      .selectAll('#histogram')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);
  }

  function showCirclez() {
    svg
      .selectAll('#latitude')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);

    svg
      .selectAll('#histogram')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);

    circlesClassVariable.props.displayType = 'all Circles';
    circlesClassVariable.showCircles();

  }

  const showCirclesGroupedByFestival = () => {
    svg.selectAll('#latitude').transition(600).duration(600).attr('opacity', 0);

    svg
      .selectAll('#histogram')
      .transition(600)
      .duration(600)
      .attr('opacity', 0);

    svg
      .selectAll('#circles')
      .transition(600)
      .duration(600)
      .attr('opacity', 1);

    circlesClassVariable.props.displayType = 'festival';
    circlesClassVariable.showCirclesGroupedByFestival();
    mapOfEnglandVariable.initVis();


  };


  chart.activate = function (index) {
    activeIndex = index;
    var sign = activeIndex - lastIndex < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };


  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  return chart;
};


export const display = (dataArgument, onScroll, onClick) => {

  data = dataArgument;

  var plot = scrollVis(onClick);
  d3.select('#vis').datum(data).call(plot, { data: data });

  var scroll = scroller().container(d3.select('#graphic'));

  scroll(d3.selectAll('.step'));

  scroll.on('active', function (index) {
    onScroll(index);
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
};
