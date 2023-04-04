class artistInfo {
  constructor(_parent, _props) {
    console.log('constructed');
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      artists: _props.artists,
      colorScheme: _props.colorScheme,
    };
    this.initVis();
  }

  initVis() {
    let vis = this;
    vis.width = vis.parent.width;
    vis.height = vis.parent.height;

    vis.container = vis.parent
      .append('div')
      .attr('class', 'annotations')
      .attr(
        'transform',
        `translate(${this.props.margin.left},${this.props.margin.top})`
      );
  }

  updateVis() {
    const formatID = (x) => {
      return x.toUpperCase().split(' ').join('_');
    };

    // Prepare data to display
    const group = d3.group(
      this.props.data.filter((d) => this.props.artists.includes(d.stage_name)),
      (d) => d.festival
    );
    const hierarchy = d3.hierarchy(group);
    const data = d3.groups(hierarchy.leaves(), (d) => d.data.stage_name);

    // Create one div per data point
    const divs = this.container.selectAll('.artist_info').data(data, (d) => d[0]);

    const divEnter = divs.enter().append('div').attr('class', 'artist_info');

    // merge with previous data
    divEnter
      .merge(divs)
      .attr(
        'transform',
        (d, i) => `translate(${this.props.margin.left},${i * 500})`
      ) // use index to calculate y position
      .transition()
      .duration(1000)
      .style('border-color', (d) => {
        console.log(d[1][0].data.gender);
        if (d[1][0].data.gender == 'f') {
          return this.props.colorScheme[0];
        } else if (d[1][0].data.gender == 'mixed') {
          return this.props.colorScheme[1];
        } else {
          return this.props.colorScheme[2];
        }
      });

    divEnter
      .append('p')
      .html(
        (d) =>
          '<h1>' +
          d[0] +
          '</h1>  <hr>' +
          '<text> Gender: ' +
          d[1][0].data.gender +
          '<br> Formation year:' +
          Math.trunc(d[1][0].data.formation) +
          '<br> Birthplace: ' +
          d[1][0].data.birthplace +
          '<br> Ethnicity: ' +
          d[1][0].data.ethnicity +
          '<br> Age at present:' +
          d[1][0].data.age_present +
          '</text>'
      )
      .on('mousemove', (event, d) => {
        console.log(d);
        d3.selectAll('#' + formatID(d[0]))
          .style('fill', 'white')
          .style('stroke', ' #C0C0BB');
      })
      .on('mouseleave', (event, d) => {
        d3.selectAll('#' + formatID(d[0]))
          .style(
            'fill',
            (d[1][0].data.gender == 'f') | (d[1][0].data.gender == 'mixed')
              ? d[1][0].data.gender == 'mixed'
                ? this.props.colorScheme[1]
                : this.props.colorScheme[0]
              : this.props.colorScheme[2]
          )
          .style('stroke', 'white');
      });

    divs.exit().remove();
  }
}
