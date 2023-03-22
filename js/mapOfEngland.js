// https://d3-graph-gallery.com/graph/backgroundmap_country.html
class mapOfEngland {
    constructor(_parent, _props, _data) {
        this.parent = _parent
        this.props = {
            margin: _props.margin,
        }
        const { x, y, width, height } = this.parent
            .node()
            .getBoundingClientRect();


        this.width = width;
        this.height = height;

    }

    initVis() {
        console.log("mappity map map")
        let vis = this;

        var projection = d3.geoMercator()
            .center([2, 47])                // GPS of location to zoom on
            .scale(980)                       // This is like the zoom
            .translate([vis.width / 2, vis.height / 2])

        // Load external data and boot
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function (data) {
            console.log("DATA map map")

            // Filter data
            data.features = data.features.filter(function (d) { console.log(d.properties.name); return d.properties.name == "United Kingdom" })

            // Draw the map
            this.parent.append("g")
                .selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("fill", "grey")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "none")
        })
    }


}