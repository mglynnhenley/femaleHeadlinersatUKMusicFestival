export const circlesGroupedByFestival = (parent, props) => {
    // unpack my props
    const {
        data,
        margin
    } = props;

    // Standard margin conventions
    const width = +parent.attr('width');
    const height = +parent.attr('height');

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Chart taking care of inner margins
    const g = parent.append('g')
    .attr('class', 'chart')
    .attr('id', 'circles')
    .attr('transform', `translate(${margin.left},${margin.top})`)


    // // 1. Group the data per festival
    const group = d3.group(data, d => d.festival);

    // // 2. Change the structure to a hierarchy structure
    const hierarchy = d3.hierarchy(group);

    var nodes = d3.groups(hierarchy.leaves());

    const festivals = hierarchy.children.map(d => d.data[0]);

    const chart = g
        .attr('class', 'chart')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    nodes.forEach((d) => {
        d.radius = 1;
    })

    const groupByFestival = (d) => {
        festivals.indexOf(d.data.festival)
        return {
            x: innerWidth / 4 * (festivals.indexOf(d.data.festival) % 4),
            y: innerHeight / 4 * Math.floor(festivals.indexOf(d.data.festival) / 4)
        }
    }

    var simulation = d3.forceSimulation(nodes)
        .force('x', d3.forceX().x((d) => {
            return groupByFestival(d).x;
        }))
        .force('y', d3.forceY().y((d) => {
            return groupByFestival(d).y;
        }))
        .force('collision', d3.forceCollide().radius(function (d) {
            return 3 * d.radius + 1
        }))
        .on('tick', ticked);

    function ticked() {
        var u = chart
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .transition().duration(200).delay((d, i) => i * 5)
            .attr('r', function (d) {
                return 3 * d.radius
            })
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
            .attr('fill', d => d.data.gender == 'f' ? '#FF5F1F' : 'grey')
            .attr('opacity', d => d.data.gender == 'f' ? 1 : 0.5)
            .attr('stroke', d => d.data.gender == 'f' ? 'blue' : 'grey');
    }





}

// circle packing 
// https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb