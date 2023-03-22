export const histogram = (parent, props) => {
  // unpack my props
  const { data, margin, id } = props

  const width = +parent.attr('width')
  const height = +parent.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const xValue = (d) => d[0]
  const yValue = (d) => d[1]

  // Chart taking care of inner margins
  const chart = parent.selectAll('.barchart').data([null])
  const chartEnter = chart
    .enter()
    .append('g')
    .attr('id', id)
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const dataPreparedForHistogram = d3.flatRollup(
    data,
    v => v.length,
    d => d.gender
  )

  // Initialise scales
  const xScale = d3
    .scaleBand()
    .domain(dataPreparedForHistogram.map(xValue))
    .range([0, innerWidth])
    .paddingInner(0.2)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataPreparedForHistogram, yValue)])
    .range([innerHeight, 0])

  // Initialise axes
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(dataPreparedForHistogram.map(d => d.keys))
    .tickSizeOuter(10)
    .tickPadding(10)

  const yAxis = d3.axisLeft(yScale).ticks(6).tickSizeOuter(0).tickPadding(10)

  // Append empty x-axis group and move it to the bottom of the chart
  const xAxisG = chartEnter
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
  xAxisG.call(xAxis)

  // Append y-axis group
  const yAxisG = chartEnter.append('g').attr('class', 'axis y-axis')
  yAxisG.call(yAxis)

  // Append y-axis title
  yAxisG
    .append('text')
    .attr('class', 'axis-title')
    .attr('x', 25)
    .attr('y', -25)
    .text('Histogram')

      
  // Plot data
  const bars = chartEnter.merge(chart)
  .selectAll('.bar').data(dataPreparedForHistogram);

  const barsEnter = bars
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(xValue(d)))
      .attr('width', xScale.bandwidth())
      .attr("y", innerHeight)
      .transition()
      .ease(d3.easeLinear) 
      .duration(2000)
      .attr('height', d => innerHeight - yScale(yValue(d)))
      .attr('y', d => yScale(yValue(d)))
      .attr('fill', d => xValue(d) == 'f' ? '#FF5F1F' : 'grey')
      .attr('opacity', d => xValue(d) == 'f' ? 1 : 0.5)
      .attr('stroke', d => xValue(d) == 'f' ? 'blue' : 'grey');



  
}
