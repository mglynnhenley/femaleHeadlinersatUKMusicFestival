export const loadAndProcessData = () =>
Promise
  .all([
    d3.csv('./data/headliners.csv'),
  ])
  .then(([data]) => {   

    // Parse CSV data 
    data.forEach(d => {
      d.year = +d.year;
      d.age_present = +d.age_present;
      d['age_(at_time_of_appearance)'] = +d['age_(at_time_of_appearance)'];
      d['years_active_(at_time_of_appearance)'] = +d['years_active_(at_time_of_appearance)']
      d.stage_name = d.stage_name.toLowerCase();
      if (d.gender !== 'f' && d.gender !== 'mixed') {
        d.genderGroup = 'other'
      } else {
        d.genderGroup = d.gender
      }
    });

    data.sort(function(x, y){
      return d3.ascending(x.gender, y.gender);
   })

    return [data]
  });

