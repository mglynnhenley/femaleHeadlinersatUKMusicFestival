class histogramCircles {
  constructor(_parent, _props, _data) {
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      xAxisLabel: _props.xAxisLabel,
      yAxisLabel: _props.yAxisLabel,
      onClick: _props.onClick,
    };
    // Margin conventions
    this.width = +this.parent.attr('width');
    this.height = +this.parent.attr('height');
    this.innerWidth =
      this.width - this.props.margin.left - this.props.margin.right;
    this.innerHeight =
      this.height - this.props.margin.top - this.props.margin.bottom;
    this.chart = this.parent.selectAll('.chart');

  }

  // grouped bar plot: https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
  showCircles() {
    let vis = this;

    this.chart.attr(
      'transform',
      `translate(${this.props.margin.left},${this.props.margin.top})`
    );


    // Prepare the data to be displayed
    let maxIndex = 0; // This will be used for our y axis range

    //Get a list of all the festivals
    var festivals = new Set();
    this.props.data.forEach((d) => {
      festivals.add(d.festival);
    });

    // produce index's for displaying the data as a histogram
    festivals.forEach((festival) => {
      let indexFemale = 0;
      let indexOther = 0;
      this.props.data.forEach((d) => {
        if (d.festival == festival) {
          if ((d.gender == 'f') | (d.gender == 'mixed')) {
            d.index_histogram = indexFemale; // assign a new 'index' property to the object
            indexFemale += 1;
          } else {
            d.index_histogram = indexOther; // assign a new 'index' property to the object
            indexOther += 1;
          }
        }
      });
      maxIndex = maxIndex > indexOther ? maxIndex : indexOther; //we always know female will be in minority
    });

    // Initialise scales
    var xScale = d3
      .scaleBand()
      .domain(festivals)
      .range([0, this.innerWidth])
      .paddingOuter(2);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxIndex])
      .range([this.innerHeight, 0]);

    // initialize axis
    const xAxis = d3.axisBottom(xScale).ticks(festivals);

    const yAxis = d3.axisLeft(yScale).ticks(20).tickSizeOuter(0).tickSizeInner(-this.innerWidth, 0, 0)
    ;

    // Append empty x-axis group and move it to the bottom of the chart
    const xAxisG = this.chart
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${this.innerHeight})`)
      .attr('class', 'histogram');

    // https://stackoverflow.com/questions/20947488/d3-grouped-bar-chart-how-to-rotate-the-text-of-x-axis-ticks
    xAxisG
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-40)');

    // Append y-axis group
    const yAxisG = this.chart
      .append('g')
      .attr('class', 'axis y-axis')
      .attr('class', 'histogram');
    yAxisG.call(yAxis);

    yAxisG
      .append('text')
      .attr('class', 'axis title')
      .attr('y', -20)
      .attr('x', 0)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text(this.props.yAxisLabel)

    xAxisG
      .append('text')
      .attr('class', 'axis title')
      .attr('y', 100)
      .attr('x', this.innerWidth / 2)
      .attr('fill', 'white')
      .attr('text-anchor', 'end')
      .text(this.props.xAxisLabel)

    // Another scale for subgroup position?
    var xSubgroup = d3
      .scaleBand()
      .domain(['f', 'other'])
      .range([0, xScale.bandwidth()])
      .paddingInner(0.5);


    // Create new circles for each group
    const g = this.chart;
    this.chart.selectAll('rect').each(function () {
      g.append(() => this);
    });

    //create the new circle elements
    const circles = this.chart
      .selectAll('rect')
      .data(this.props.data, (d) => d.stage_name)
      

    //append a new circle for each data element
    const circlesEnter = circles.enter().append('rect');

    const tooltipPadding = 25
    const rectHeight = this.innerHeight/maxIndex

    //plot circles
    circlesEnter
      .merge(circles)
      .attr('id', d => d.stage_name)
      .attr('class', 'histogram')
      .on('mousemove', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'inline-block')
          .style('left', event.pageX + tooltipPadding + 'px')
          .style('top', event.pageY + tooltipPadding + 'px')
          .html('<div class="tooltip-title">' + d.stage_name + '</div>');
        d3.selectAll('#'+d.stage_name).style('fill', 'white');
      })
      .on('mouseleave', (event, d) => {
        d3.select('#tooltip').style('display', 'none');
        d3.selectAll('#'+d.stage_name).style('fill', (d.gender == 'f') | (d.gender == 'mixed')
        ? d.gender == 'mixed'
          ? 'purple'
          : '#FF10F0'
        : 'blue')
      })
      .on('click', (event,d) => this.props.onClick(d.stage_name))
      .transition('hello')
      .duration(1000)
      .delay((d, i) => {
        if ((d.gender == 'f') | (d.gender == 'mixed')) {
          return yScale(maxIndex - d.index_histogram * 10);
        } else {
          return yScale(maxIndex - d.index_histogram * 10);
        }
      })
      .attr('x', (d) => {
        return (
          xScale(d.festival) +
          xSubgroup((d.gender == 'f') | (d.gender == 'mixed') ? 'f' : 'other') /
          2
        );
      })
      .attr('y', function (d) {
        return yScale(d.index_histogram) - rectHeight; // we have to adjust because of the radius of the circle
      })
      .attr('fill', (d) =>
        (d.gender == 'f') | (d.gender == 'mixed')
          ? d.gender == 'mixed'
            ? 'purple'
            : '#FF10F0'
          : 'blue'
      )
      .attr('width', 12)
      .attr('height', rectHeight)

    circles.exit().remove();
  }
}
