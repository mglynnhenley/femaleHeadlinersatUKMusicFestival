// https://stackoverflow.com/questions/57277281/d3-how-to-update-force-simulation-when-data-values-change
class summaryCircles {
  constructor(_parent, _props, _data) {
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      onClick: _props.onClick,
    };

    // Margin conventions
    this.width = +this.parent.attr('width');
    this.height = +this.parent.attr('height');
    this.innerWidth =
      this.width - this.props.margin.left - this.props.margin.right;
    this.innerHeight =
      this.height - this.props.margin.top - this.props.margin.bottom;

    const g = this.parent.append('g');
    this.simulation = null;

    this.chart = g
      .attr('class', 'chart')
      .attr('id', 'circles')
      .attr(
        'transform',
        `translate(${this.props.margin.left},${this.props.margin.top})`
      );

    this.centre = { x: this.innerWidth / 2, y: this.innerHeight / 2 };
  }

  showCircles() {
    let vis = this;

    // Get the chart object and move to the correct position
    this.parent
      .selectAll('.chart')
      .attr(
        'transform',
        `translate(${this.props.margin.left},${this.props.margin.top})`
      );

    // This is the data for the Summary data set
    const dataToDisplay = d3.groups(this.props.data, (d) => d.stage_name);
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
      .attr('cx', (d) => vis.centre.x)
      .attr('cy', (d) => vis.centre.y);

    // create simulation for this data set
    this.simulation = d3.forceSimulation(dataToDisplay);

    // Define each tick of simulation
    this.simulation.on('tick', () => {
      vis.chart
        .selectAll('circle')
        .transition('circle2')
        .duration(90)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });

    // Stop the simulation until later
    this.simulation.stop();

    // Tooltip event listeners

    circlesEnter
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
            ? 'purple'
            : '#FF10F0'
          : 'blue'
      )
      .attr('stroke-width', (d) =>
        (d[1][0].gender == 'f') | (d[1][0].gender == 'mixed')
          ? d[1][0].gender == 'mixed'
            ? 2
            : 3
          : 1
      );

    circles.exit().remove();

    const tooltipPadding = 25;
    
    vis.chart
      .selectAll('circle')
      .on('mousemove', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'inline-block')
          .style('left', event.pageX + tooltipPadding + 'px')
          .style('top', event.pageY + tooltipPadding + 'px')
          .html('<div class="tooltip-title">' + d[0] + '</div>');
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      })
      .on('click',  (event,d) => this.props.onClick(d[0]))


    // Specify the simulation force for each data point
    this.simulation
      .force('center', d3.forceCenter(this.centre.x, this.centre.y))
      .force(
        'collide',
        d3.forceCollide().radius(function (d) {
          return 12 * d.radius;
        })
      );

    // Reset the force ( for scrolling back up )
    this.simulation.alpha(1).alphaTarget(0).restart();
  }
}
