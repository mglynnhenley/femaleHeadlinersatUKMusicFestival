class treeClass {
  constructor (_parent, _props, _data) {
    console.log('constructed')
    this.parent = _parent
    this.props = {
      data: _props.data,
      margin: _props.margin,
      index: _props.index,
    }
    const { x, y, width, height } = this.parent
    .node()
    .getBoundingClientRect();


    this.width = width;
    this.height = height;

  }

  initVis() {
    let vis = this;
    
    const innerWidth =
      vis.width - vis.props.margin.left - vis.props.margin.right;
    const innerHeight =
      vis.height - vis.props.margin.top - vis.props.margin.bottom;

    const g = this.parent.append('g')

    const dataWithoutMen = this.props.data.filter(d => d.gender == 'f')

    // // 1. Group the data per festival, per year the then per stage name
    const group = d3.group(
        dataWithoutMen,
        d => d.festival,
        d => d.year)

    // // 2. Change the structure to a hierarchy structure
    const treeData = d3.hierarchy(group)

    const chart = g
        .attr('id', 'tree')
        .attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`)

    const treeLayout = d3.tree().size([innerWidth, innerHeight])
    const links = treeLayout(treeData).links()

    function elbow(d, i) {
        return "M" + d.source.x + "," + d.source.y
            + "V" + d.target.y + "H" + d.target.x
            + (d.target.children ? "" : ("v"))
    }

    // rectangle 
    var rectangle = chart
                        .append('rect')
                        .attr('class', 'scroll-rectangle')
                        .attr('width', innerWidth)
                        .attr('height', innerHeight / 10)
                        .attr('y', -10);

    // Create one path per link
    var link = chart
        .selectAll('.edge')
        .data(links)
        .join('path')
        .attr('class', 'link')
        .attr('d', elbow);

    var nodesGroup = chart
        .selectAll('.node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('x', d => d.x)
        .attr('y', d => d.y);

    nodesGroup
        .append('text')
        .attr('class', 'label')
        .attr('id', d => d.data.stage_name)
        .attr('x', d => d.x)
        .attr('y', d => d.y - 10)
        .attr('text-anchor', d => 'left')
        .attr('font-size', d => 2.25 - 0.5 * d.depth + 'em')
        .text(d => d.data[0] ?? (d.data.stage_name ?? 'Festivals'))
        .attr('opacity', d => 0)
        .on('hover', d => d3.selectAll('#' + d.data.stage_name).attr('opacity', 1));

    nodesGroup
        .append('circle')
        .attr('class', 'node-circle')
        .attr('r', d => 2)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

  }

  /**
   * updateVis(): Class method to update visualisation
   */
  updateVis() {
    let vis = this;

    const mapIndexToColor = ['pink', 'green', 'yellow', 'blue', 'red', 'orange']

    var rectangle = vis.parent
                        .selectAll('rect.scroll-rectangle')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(300)
                        .style("fill", mapIndexToColor[this.props.index])
                        .attr(
                          'transform',
                          `translate(${0},${this.props.index * innerHeight/5.5})`
                        )
                        .transition();

  }
}
