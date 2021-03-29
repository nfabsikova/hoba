export function makeChart13(ba, grid, danube, danubeLine) {

    //Width and Height
    let width = 800;
    let height = 600;

    //Colors
    let colors = ["#878787"];

    //Define quantize scale to sort data values into buckets of color
    let colorScale = d3.scaleThreshold()
                .domain([22, 25, 28, 31, 34, 37, 40, 49])
                .range(["#ffffff", "#fdf0ec", "#f9dfd9", "#f7d0c7", "#f4beb5", "#ef9c91", "#e8776f", "#e14e51"]);

    //Load forrest area
    Promise.all([
    ]).then(updateChart)

    function updateChart() {
      console.log(grid);

    //Define projection and path generator
    let projection = d3.geoMercator().fitSize([width, height], ba);

    let path = d3.geoPath().projection(projection);

    //Set grid rectangle size 
    let randomRect = grid.features[100];
    let upLeft = randomRect.geometry.coordinates[0][0][1];
    let upRight = randomRect.geometry.coordinates[0][0][2];
    let rectSide = projection([upRight[0], upRight[1]])[0] - projection([upLeft[0], upLeft[1]])[0];
    let rectCurve = 1.5;
    console.log(upLeft);

    //Create svg
    let chart = d3.select("#chart_13")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //Add bratislava outline
      chart.append("g")
        .attr("class", "ba")
        .selectAll("path")
        .data(ba.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", colors[0])
        .style("stroke-width", "1.2");

      //Add grid
      let gridRects = chart.append("g")
              .attr("class", "grid")
              .selectAll("path.grid")
              .data(grid.features.filter(d => d.properties.temp != null))
              .enter()
              .append("path")
              .attr("d", path);
    

    }


}