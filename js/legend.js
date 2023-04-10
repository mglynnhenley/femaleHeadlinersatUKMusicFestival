export const colourLegend = (parent, props) => {
  const { legendType, colourScale, keys } = props;

  // padding for tool tip
  const tooltipPadding = 25;

  // title for the legend
  parent
    .append('text')
    .text('Gender of the artist or group:')
    .attr('class', 'subtitle')
    .attr('transform', `translate(0,30)`);

  if (legendType == 'rect') {
    var size = 30;
    parent
      .selectAll(legendType)
      .data(keys)
      .enter() // only need the enter part of the enter/merge/exit pattern since there will be no change in data throughout visualization
      .append(legendType)
      .on('mousemove', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'inline-block')
          .style('left', event.pageX + tooltipPadding + 'px')
          .style('top', event.pageY + tooltipPadding + 'px')
          .html(
            '<div class="tooltip-title"> Hover over or click the bars in the visualization -> </div>'
          );
      })
      .on('mouseleave', () => d3.select('#tooltip').style('display', 'none'))
      .attr('x', 100)
      .attr('y', (d, i) => 70 + i * (size + 5))
      .attr('width', size)
      .attr('height', size)
      .style('fill', colourScale)
      .style('stroke', 'white');

    // Add one dot in the legend for each name.
    parent
      .selectAll('.labels')
      .data(keys)
      .enter()
      .append('text')
      .attr('class', 'labels')
      .attr('x', 120 + size * 1.2)
      .attr('y', (d, i) => 70 + i * (size + 5) + size / 2)
      .text((d) => d)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  } else if (legendType == 'circle') {
    var size = 20;

   // Add one circle in the legend for each name.
    parent
      .selectAll('.colorCircleLegend')
      .data(keys)
      .enter()
      .append(legendType)
      .on('mousemove', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'inline-block')
          .style('left', event.pageX + tooltipPadding + 'px')
          .style('top', event.pageY + tooltipPadding + 'px')
          .html(
            '<div class="tooltip-title"> Hover over or click the circles in the visualization -> </div>'
          );
      })
      .on('mouseleave', (event, d) => {
        d3.select('#tooltip').style('display', 'none');
      })
      .attr('class', 'colorCircleLegend')
      .attr('cx', 100)
      .attr('cy', (d, i) => 90 + i * (2 * size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('r', size)
      .style('fill', colourScale)
      .style('stroke', 'white');

    // Add the labels in the legend for each name.
    parent
      .selectAll('.labels')
      .data(keys)
      .enter()
      .append('text')
      .attr('class', 'labels')
      .attr('x', 100 + size * 2)
      .attr('y', (d, i) => 90 + i * (2 * size + 5))
      .text((d) => d)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  }
};
