// https://gist.github.com/d3noob/8326869
export const tree = (parent, props) => {
    // unpack my props
    const { data, margin } = props
    
    // Standard margin conventions
    const width = +parent.attr('width')
    const height = +parent.attr('height')
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom


    // Chart taking care of inner margins
    const g = parent.append('g')

    /// 0. Filter out the male data
    const dataWithoutMen = data.filter(d => d.gender == 'f');

    // 0.5. Sort by the alphabetical name of the artist

    // // 1. Group the data per festival, per year the then per stage name
    const group = d3.group(
        dataWithoutMen,
        d => d.festival,
        d => d.year    )

    // // 2. Change the structure to a hierarchy structure
    const treeData = d3.hierarchy(group)

    const chart = g
        .attr('class', 'chart')
        .attr('id', 'tree')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    const treeLayout = d3.tree().size([innerWidth*3/4, innerHeight*3/4])
    const links = treeLayout(treeData).links()

    function elbow(d, i) {
        return "M" + d.source.x + "," + d.source.y
            + "V" + d.target.y + "H" + d.target.x
            + (d.target.children ? "" : ("v" + margin.bottom))
    }

    // This is for the scrolling rectangle
    chart
        .append('rect')
        .attr('class', 'scroll-rectangle')
        .attr('width', -innerWidth)
        .attr('height', 90)
        .attr('x', -400)
        .attr('y', -350);
        
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
            .attr('y', d => d.y );

    nodesGroup
        .append('text')
        .attr('class', 'label')
        .attr('x', d => d.x)
        .attr('y', d => d.y )
        .attr('text-anchor', d => d.children ? 'middle' : 'start')
        .attr('font-size', d => 2.25 - 0.5 * d.depth + 'em')
        .text(d => d.data[0] ?? ( d.data.stage_name ?? 'Festivals' ))
        .attr('opacity', d => 0);
    
    nodesGroup
        .append('circle')
        .attr('class', 'node-circle')
        .attr('r', d => 5)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y );


}
