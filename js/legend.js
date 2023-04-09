export const colourLegend = (parent, props) => {
  const {
    legendType,
    colourScale,
    keys,
    borderWeightScale
  } = props


  var color = d3.scaleOrdinal().domain(keys).range(colourScale)

  var borderWeight = d3.scaleOrdinal().domain(keys).range(borderWeightScale)

  const sizeKeys = [1, 2, 8]

  var sizeScale = d3
    .scaleSqrt() // instead of scaleLinear()
    .domain([0, 6])
    .range([0, 20])
  
  parent.append('text').text('Gender of the artist or group:').attr('class', 'subtitle').attr('transform', `translate(0,30)`)
    
  if (legendType == 'rect') {
    var size = 30
    parent
      .selectAll(legendType)
      .data(keys)
      .enter()
      .append(legendType)
      .on('mousemove', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'inline-block')
          .style('left', event.pageX + tooltipPadding + 'px')
          .style('top', event.pageY + tooltipPadding + 'px')
          .html('<div class="tooltip-title"> Hover over or click the bars in the visualization -> </div>');
      })
      .on('mouseleave', (event, d) => {
        d3.select('#tooltip').style('display', 'none');
      })
      .attr('x', 100)
      .attr('y', function (d, i) {
        return 70 + i * (size + 5)
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('width', size)
      .attr('height', size)
      .style('fill', function (d) {
        return color(d)
      })
      .style('stroke', 'white')

    // Add one dot in the legend for each name.
    parent
      .selectAll('.mylabels')
      .data(keys)
      .enter()
      .append('text')
      .attr('class', 'mylabels')
      .attr('x', 120 + size * 1.2)
      .attr('y', function (d, i) {
        return 70 + i * (size + 5) + size / 2
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) {
        return d
      })
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
  }
  const tooltipPadding = 25
  if (legendType == 'circle') {
    var size = 20
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
          .html('<div class="tooltip-title"> Hover over or click the circles in the visualization -> </div>');
      })
      .on('mouseleave', (event, d) => {
        d3.select('#tooltip').style('display', 'none');
      })
      .attr('class', 'colorCircleLegend')
      .attr('cx', 100)
      .attr('cy', function (d, i) {
        return 90 + i * (2 * size + 5)
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('r', size)
      .style('fill', function (d) {
        return color(d)
      })
      .style('stroke', 'white');
      

    // Add one dot in the legend for each name.
    parent
      .selectAll('.mylabels')
      .data(keys)
      .enter()
      .append('text')
      .attr('class', 'mylabels')
      .attr('x', 100 + size * 2)
      .attr('y', function (d, i) {
        return 90 + i * (2 * size + 5) 
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) {
        return d
      })
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')

    }
}
