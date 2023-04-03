export const lineGraph = (parent, props) => {
  const { data, margin } = props

  var width = +parent.attr('width')
  var height = +parent.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const dataSortedByYear = d3.groups(data, d => d.year).sort((x, y) => x[0] < y[0])

  dataSortedByYear.forEach((year) => {
    const headliners = year[1];
    const totalHeadliners = headliners.length;
    const womenHeadliners =
      headliners.filter((headliner) => headliner.gender == 'f').length;
    year.push((womenHeadliners / totalHeadliners));
    console.log(year);
  });


  // Add X axis --> it is a date format
  var xScale = d3.scaleTime()
    .domain(d3.extent(dataSortedByYear, function (d) { return d[0]; }))
    .range([0, innerWidth]);

  parent.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0])

  parent.append("g")
    .call(d3.axisLeft(yScale));

  // Add the line
  parent.selectAll('circle')
    .data(dataSortedByYear)
    .join('circle')
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr('r', 1)
    .attr('cx', (d) => xScale(d[0]))
    .attr('cy', (d) => yScale(d[2]));


}
