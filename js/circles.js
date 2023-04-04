// https://stackoverflow.com/questions/57277281/d3-how-to-update-force-simulation-when-data-values-change
class circles {
  constructor(_parent, _props, _data) {
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      onClick: _props.onClick,
      colorScheme: _props.colorScheme,
    };
    this.initVis();
  }

  initVis() {
    
    let vis = this;
    // Margin conventions
    vis.width = +vis.parent.attr('width');
    vis.height = +vis.parent.attr('height');
    vis.innerWidth = vis.width - vis.props.margin.left - vis.props.margin.right;
    vis.innerHeight =
      vis.height - vis.props.margin.top - vis.props.margin.bottom;

    const g = vis.parent.append('g');
    vis.simulation = null;

    vis.chart = g
      .attr('class', 'chart')
      .attr('id', 'circles')
      .attr(
        'transform',
        `translate(${vis.props.margin.left},${vis.props.margin.top})`
      );

    vis.centre = { x: vis.innerWidth / 2, y: vis.innerHeight / 2 };
  }

  updateVis() {
    const formatID = (x) => {
      return x.toUpperCase().split(' ').join('_')
  }
    let vis = this;

    // Get the chart object and move to the correct position
    vis.parent
      .selectAll('.chart')
      .attr(
        'transform',
        `translate(${vis.props.margin.left},${vis.props.margin.top})`
      );

    // vis is the data for the Summary data set
    const dataToDisplay = d3.groups(vis.props.data, (d) => d.stage_name);
    dataToDisplay.forEach((d) => {
      d.radius = Math.sqrt(d[1].length);
    });

    // select all circles and change
    const circles = vis.chart
      .selectAll('circle')
      .data(dataToDisplay, (d) => d[0]);

    // create circle element for each element
    const circlesEnter = circles
      .enter()
      .append('circle')
      .attr('id', (d) => formatID(d[0]))
      .attr('cx', (d) => vis.centre.x)
      .attr('cy', (d) => vis.centre.y);

    // create simulation for vis data set
    vis.simulation = d3.forceSimulation(dataToDisplay);

    // Define each tick of simulation
    vis.simulation.on('tick', () => {
      vis.chart
        .selectAll('circle')
        .transition('circle2')
        .duration(90)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });

    // Stop the simulation until later
    vis.simulation.stop();

    circlesEnter
      .attr('id', (d) => formatID(d[0]))
      .merge(circles)
      .transition()
      .duration(2000)
      .attr('r', function (d) {
        return 9 * d.radius;
      })
      .attr('stroke', (d) => 'white')
      .attr('fill', (d) =>
        (d[1][0].gender == 'f') | (d[1][0].gender == 'mixed')
          ? d[1][0].gender == 'mixed'
            ? vis.props.colorScheme[1]
            : vis.props.colorScheme[0]
          : vis.props.colorScheme[2]
      );

    circles.exit().remove();

    //Tooltip listeners
    const tooltipPadding = 25;
    vis.chart
      .selectAll('circle')
      .attr('id', (d) => formatID(d[0]))
      .on('mousemove', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'inline-block')
          .style('left', event.pageX + tooltipPadding + 'px')
          .style('top', event.pageY + tooltipPadding + 'px')
          .html(
            '<div class="tooltip-title"> <b>' +
              d[0] +
              '</b> has played at <b>' +
              d[1].length +
              '</b> festival' +
              (d[1].length >
              1
              ?'s'
              :'' + '</div>' )
          );
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      })
      .on('click', (event, d) => vis.props.onClick(d[0]));

    // Specify the simulation force for each data point
    vis.simulation
      .force('center', d3.forceCenter(vis.centre.x, vis.centre.y))
      .force(
        'collide',
        d3.forceCollide().radius(function (d) {
          return 12 * d.radius;
        })
      );

    // Reset the force ( for scrolling back up )
    vis.simulation.alpha(1).alphaTarget(0).restart();
  }
}
