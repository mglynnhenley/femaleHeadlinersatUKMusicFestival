export const loadAndProcessData = () =>
Promise
  .all([
    d3.csv('../data/headliners_with_location.csv'),
    d3.json('./data/united-kingdom.geojson'),
    d3.csv('../data/artist_info_merged_with_spotify.csv'),

  ])
  .then(([data, geoData, artistData]) => {   

    // Parse CSV data 
    data.forEach(d => {
      d.year = +d.year;
      d.age_present = +d.age_present;
      d['age_(at_time_of_appearance)'] = +d['age_(at_time_of_appearance)'];
      d['years_active_(at_time_of_appearance)'] = +d['years_active_(at_time_of_appearance)']
      d.longitude = +d.longitude;
      d.latitude = +d.latitude;
      d.stage_name = d.stage_name.toLowerCase();
    });

    artistData.forEach(d => {
      d.popularity = +d.popularity;
      d.name = d.name.toLowerCase();
    })

    data.sort(function(x, y){
      return d3.ascending(x.gender, y.gender);
   })

    return [data, geoData, artistData]
  });

