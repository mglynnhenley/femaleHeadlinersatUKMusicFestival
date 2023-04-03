class artistInfo {
  constructor(_parent, _props) {
    console.log('constructed');
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      artists: _props.artists,
    };

    // Why is the data no being passed in ?
    console.log(this.props.data);

    this.width = this.parent.width;
    this.height = this.parent.height;

    this.box = this.parent.selectAll('.annotations').data([null]);
    this.boxEnter = this.box
      .enter()
      .append('div')
      .attr('class', 'annotations')
      .attr(
        'transform',
        `translate(${this.props.margin.left},${this.props.margin.top})`
      );
  }

  initVis() { }

  updateVis() {
    const group = d3.group(
      this.props.data.filter((d) =>
        this.props.artists.includes(d.stage_name)
      ),
      (d) => d.festival
    );
    const hierarchy = d3.hierarchy(group);
    const data = d3.groups(hierarchy.leaves(), (d) => d.data.stage_name);

    const divs = this.boxEnter
      .merge(this.box)
      .selectAll('div')
      .data(data, (d) => d[0]);

    const divEnter = divs.enter().append('div').attr('class', 'artist_info');

    divEnter
      .merge(divs)
      .attr(
        'transform',
        (d, i) => `translate(${this.props.margin.left},${i * 500})`
      ) // use index to calculate y position
      .transition()
      .duration(1000)
      .style('border-color', d => {
        console.log(d[1][0].data.gender)
        if (d[1][0].data.gender == 'f') {
          return '#FF10F0'
        } else if (d[1][0].data.gender == 'mixed') {
          return 'purple'
        } else  {
          return 'blue'
        }
      })
      

    divs.exit().remove();

    divEnter
      .append('p')
      .html(
        (d) =>
          '<h1>' +
          d[0] +
          '</h1>  <hr>' +
          '<b>Gender: </b>' +
          d[1][0].data.gender +
          '<br> <b>Formation year: </b>' +
          Math.trunc(d[1][0].data.formation) +
          '<br> <b>Birthplace: </b>' +
          d[1][0].data.birthplace +
          '<br> <b>Ethnicity: </b>' +
          d[1][0].data.ethnicity +
          '<br> <b>Age at present: </b>' +
          d[1][0].data.age_present
      );

      this.box.exit().remove();
  }
}

