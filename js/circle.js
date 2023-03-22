// https://stackoverflow.com/questions/57277281/d3-how-to-update-force-simulation-when-data-values-change
class circle {

    constructor(_parent, _props, _data) {
        this.parent = _parent;
        this.props = {
            data: _props.data,
            margin: _props.margin,
            displayType: _props.displayType,
            onClick: _props.onClick,
        };


        this.simulation2 = d3.forceSimulation();

        // Margin conventions
        this.width = +this.parent.attr('width');
        this.height = +this.parent.attr('height');
        this.innerWidth = this.width - this.props.margin.left - this.props.margin.right;
        this.innerHeight = this.height - this.props.margin.top - this.props.margin.bottom;

        const g = this.parent.append('g');

        this.chart = g
            .attr('class', 'chart')
            .attr('id', 'circles')
            .attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`)

    }

    showCircles() {
        if (this.props.displayType = 'all Circles') {
            let vis = this;

            const xCentre = vis.innerWidth / 2
            const yCentre = vis.innerHeight / 2

            const group = d3.group(vis.props.data, d => d.festival);
            const hierarchy = d3.hierarchy(group);
            const nodes = d3.groups(hierarchy.leaves(), d => d.data.stage_name);

            nodes.forEach(d => {
                d.radius = d[1].length
            })

            vis.simulation2
                .alpha(0.5)
                .alphaTarget(0)
                .restart();

            vis.simulation2.nodes(nodes)
                .force('x', d3.forceX().x((d) => {
                    return xCentre;
                }))
                .force('y', d3.forceY().y((d) => {
                    return yCentre;
                }))
                .force(
                    'collision',
                    d3.forceCollide().radius(function (d) {
                        return 6 * d.radius
                    })
                )
                .on('tick', ticked)

            function ticked() {
                var u = vis.chart
                    .selectAll('circle')
                    .data(nodes)
                    .join('circle')
                    .on('click', vis.props.onClick)
                    .transition()
                    .duration(100)
                    .delay((_d, i) => i * 5)
                    .attr('r', function (d) {
                        return 5 * d.radius
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

    }

    showCirclesGroupedByFestival() {
        if (this.props.displayType = 'festival') {

            let vis = this;

            // // 1. Group the data per festival
            const group = d3.group(vis.props.data, d => d.festival);
            var hierarchy = d3.hierarchy(group);
            var nodes = d3.groups(hierarchy.leaves());
            var festivals = hierarchy.children.map(d => d.data[0]);

            nodes.forEach((d) => {
                d.radius = 1;
            })

            const groupByFestival = (d) => {
                festivals.indexOf(d.data.festival)
                return {
                    x: this.innerWidth / 4 * (festivals.indexOf(d.data.festival) % 4),
                    y: this.innerHeight / 4 * Math.floor(festivals.indexOf(d.data.festival) / 4)
                }
            }


            vis.simulation2
                .alpha(0.5)
                .alphaTarget(0.3)
                .restart();


            vis.simulation2.nodes(nodes)
                .force('x', d3.forceX().x((d) => {
                    return groupByFestival(d).x;
                }))
                .force('y', d3.forceY().y((d) => {
                    return groupByFestival(d).y;
                }))
                .force('collision', d3.forceCollide().radius(function (d) {
                    return 3 * d.radius + 1
                }))
                .on('tick', tickedByFestival);

            function tickedByFestival() {
                var u = vis.chart
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

    }
}