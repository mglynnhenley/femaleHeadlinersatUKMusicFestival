export const map = (parent, props) => {
  const { countries, locations, margin } = props

  var width = +parent.attr('width')
  var height = +parent.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Define projection and pathGenerator
  const projection = d3.geoMercator().fitSize([innerWidth, innerHeight], countries)
  const pathGenerator = d3.geoPath().projection(projection)

  // Group for map elements
  const g = parent.append('g').attr('id', 'map')

  const location_data = d3.group(locations, d => d.festival)

  const tooltipPadding = 15

  // Render the map by using the path generator indRadius(d)
  g.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', pathGenerator)

  let rect = g.selectAll('rect').data(location_data, d => d[0])


  rect.each(function() { g.append(() => this); });

  rect.join('rect')
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
    .transition().duration(1000).delay((d,i) => i*1000)
    .attr('fill', 'none')
    .attr('x', d => projection([d[1][0].longitude, d[1][0].latitude])[0])
    .attr('y', d => projection([d[1][0].longitude, d[1][0].latitude])[1])
    .attr('width',10)
    .attr('height',10)
    .attr('stroke', 'white')
    .attr('fill', 'white')
    
  //we need to do this so that the circle shows above the map
  rect.each(function() { g.append(() => this); });

}
