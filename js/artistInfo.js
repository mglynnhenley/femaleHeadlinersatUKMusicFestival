class artistInfo {
    constructor(_parent, _props, _data) {
        console.log("constructed")
        this.parent = _parent;
        this.props = {
            data: _props.data,
            margin: _props.margin,
            artists: _props.artists,
        };

        const { x, y, width, height } = this.parent
            .node()
            .getBoundingClientRect();
        this.width = width;
        this.height = height;
    }

    initVis() {
        this.data = this.props.data.filter(d => this.props.artists.includes(d.stage_name))
        const g = this.parent.selectAll('g')
        g.join()
            .data(this.data)
            .enter()
            .append('text')
            .attr('id', 'artist-info')
            .attr('transform', `translate(${this.props.margin.left},${100})`)
            .text(d => d.stage_name);
    }

    updateVis() {
        this.data = this.props.data.filter(d => this.props.artists.includes(d.stage_name))
        const g = this.parent.selectAll('g')
        g.join()
            .data(this.props.artists)
            .enter()
            .append('text')
            .attr('id', 'artist-info')
            .attr('transform', `translate(${this.props.margin.left},${100})`)
            .attr('x', 0)
            .attr('y', d => this.props.artists.indexOf(d)*40)
            .text(d => d);
    }
}