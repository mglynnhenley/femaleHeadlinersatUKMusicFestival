export const loadAndProcessData = () =>
Promise
  .all([
    d3.csv('../data/headliners_processed.csv'),
  ])
  .then(([data]) => {   

    // Parse CSV data 
    data.forEach(d => {
      d.year = +d.year;
      d.age_present = +d.age_present;
      d['age_(at_time_of_appearance)'] = +d['age_(at_time_of_appearance)'];
      d['years_active_(at_time_of_appearance)'] = +d['years_active_(at_time_of_appearance)']
    });

    // // 1. Group the data per festival
    // const group = d3.group(data, d => d.festival);

    // // 2. Change the structure to a hierarchy structure
    // const hierarchy = d3.hierarchy(group);

    // return hierarchy;
    return data
  });

