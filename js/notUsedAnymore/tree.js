// https://gist.github.com/d3noob/8326869
export const tree = (parent, props) => {
    // unpack my props
    const { data, margin } = props

    console.log(margin)

    const { x, y, width, height } = parent
        .node()
        .getBoundingClientRect();

    console.log(width + ',' + height)


    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    console.log('treee:')
    console.log(innerWidth)

    // Chart taking care of inner margins
    const g = parent.append('g')

    /// 0. Filter out the male data
    const dataWithoutMen = data.filter(d => d.gender == 'f');


    // // 1. Group the data per festival, per year the then per stage name
    const group = d3.group(
        dataWithoutMen,
        d => d.festival,
        d => d.year)

    // // 2. Change the structure to a hierarchy structure
    const treeData = d3.hierarchy(group)

    const chart = g
        .attr('id', 'tree')
        .attr('transform', `translate(${margin.left},${margin.top})`)

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
                        .attr('height', innerHeight / 5);

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
