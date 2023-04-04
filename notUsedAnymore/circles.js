export const circles = (parent, props) => {
    // unpack my props
    const { data, margin } = props

    // Standard margin conventions
    const width = +parent.attr('width')
    const height = +parent.attr('height')
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Chart taking care of inner margins
    const g = parent.append('g');

    const xCentre = innerWidth / 2
    const yCentre = innerHeight / 2

        // // 1. Group the data per festival
    const group = d3.group(data, d => d.festival);

    // // 2. Change the structure to a hierarchy structure
    const hierarchy = d3.hierarchy(group);

    var nodes = d3.groups(hierarchy.leaves(), d => d.data.stage_name);
    console.log(nodes);

    const chart = g
        .attr('class', 'chart')
        .attr('id', 'circles')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    nodes.forEach(d => {
        d.radius = d[1].length
    })

    var simulation = d3
        .forceSimulation(nodes)
        .force('center', d3.forceCenter(xCentre, yCentre))
        .force(
            'collision',
            d3.forceCollide().radius(function (d) {
                return 3 * d.radius + 1
            })
        )
        .on('tick', ticked)

    function ticked() {
        var u = chart
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .transition()
            .duration(100)
            .delay((_d, i) => i * 5)
            .attr('r', function (d) {
                return 3 * d.radius
            })
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
            .attr('fill', d => (d[1][0].data.gender == 'f' ? '#FF5F1F' : 'grey'))
            .attr('opacity', d => (d[1][0].data.gender == 'f' ? 1 : 0.5))
            .attr('stroke', d => (d[1][0].data.gender == 'f' ? 'blue' : 'grey'))
    }
}

// circle packing
// https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb
