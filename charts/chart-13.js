export function makeChart13(ba, grid, gridBg, danube, danubeLine) {

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

    //Define projection and path generator
    let projection = d3.geoMercator().fitSize([width, height], ba);

    let path = d3.geoPath().projection(projection);

    //Set grid rectangle size 
    let randomRect = grid.features[100];
    let upLeft = randomRect.geometry.coordinates[0][0][1];
    let upRight = randomRect.geometry.coordinates[0][0][2];
    let rectSide = (projection(upRight)[0] - projection(upLeft)[0]) * 0.98;
    let rectCurve = 2.5;

    //Create svg
    let chart = d3.select("#chart_13")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

      //Add grid
      let gridRects = chart.append("g")
              .attr("class", "grid")
              .selectAll("rect")
              .data(grid.features.filter(d => d.properties.temp != null))
              .enter()
              .append("rect")
              .attr("class", (d, i) => "i" + i)
              .attr("x", function(d) {
                  let upLeft = d.geometry.coordinates[0][0][1];
                  return projection(upLeft)[0]
              }) 
              .attr("y", function(d) {
                  let upLeft = d.geometry.coordinates[0][0][1];
                  return projection(upLeft)[1]
              }) 
              .attr("width", rectSide) 
              .attr("height", rectSide) 
              .attr("rx", rectCurve)
              .attr("ry", rectCurve)
              .attr("transform", function(d) {
                  let upLeft = d.geometry.coordinates[0][0][1];
                  let center = [projection(upLeft)[0] + rectSide/2,
                              projection(upLeft)[1] + rectSide/2]
                  return "rotate(" + 5 + " " + center[0] + " " + center[1] + ")"
              })
              .attr("opacity", 1)
              .attr("fill", d => colorScale(d.properties.temp))
              .attr("stroke", d => colorScale(d.properties.temp));

        //Add white background
        chart.append("g")
        .attr("class", "bg")
          .selectAll("path")
          .data(gridBg.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", "white")
          .style("stroke", "none");


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
    
      chart.append("circle")
      .attr("cx", projection(upLeft)[0])
      .attr("cy", projection(upLeft)[1])
      .attr("r", "3px")
      .attr("fill", "black")

      chart.append("circle")
      .attr("cx", projection(upRight)[0])
      .attr("cy", projection(upRight)[1])
      .attr("r", "3px")
      .attr("fill", "blue")




    }


}