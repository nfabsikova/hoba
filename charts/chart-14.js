export function makeChart14(mc, ba, grid, gridBg, danube, danubeLine) {

  // *** CHART SETTINGS ***
  console.log(grid);

  let footnote = "Ohrozenie zrážkami podľa štvorcov 1x1km, Zdroj: Atlas hodnotenia dopadov zmeny klímy na území hlavného mesta SR Bratislavy";

  //Width and Height
  let width = 800;
  let height = 700;
  let marginBottom = 60;

  //Colors
  let colors = ["#878787"];

  //Define quantize scale to sort data values into buckets of color
  let colorScale = d3.scaleThreshold()
              .domain([1, 10, 40, 70, 100])
              .range(["#ffffff", "#e0dfeb", "#d5d1df", "#7e739e", "#52467d", "#282254"]);

  //Define legend keys and position
  let lgKeys = ["1–10 / km²", "10–40 / km²", "40–70 / km²", "70–100 / km²", "viac ako 100 budov / km²"].reverse();
  let lgColors = ["#e0dfeb", "#d5d1df", "#7e739e", "#52467d", "#282254"].reverse();
  let lgTop = height * 0.6;
  let lgLeft = width * 0.12;
  let lgHeight = 25;

  // *** END OF SETTINGS ***

  //Create all chart elements
  d3.select("#chart14").append("div").attr("id", "chart14_container");

  //Create svg
  let chart = d3.select("#chart14_container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //Create tooltip
  let tooltip = d3.select("#chart14_container").append("div").attr("id", "tooltip14").attr("class", "hidden").append("p");
  tooltip.append("span").attr("id", "value14").attr("class", "numbers").text("100 budov").append("span");
  tooltip.append("span").text("/km");
  tooltip.append("span").append("sup").text("2");

  //Create footnote
  d3.select("#chart14").append("hr");
  d3.select("#chart14").append("p").attr("class", "footnote").text(footnote);

  //Load forrest area
  Promise.all([
  ]).then(updateChart)

  function updateChart() {

  //Define projection and path generator
  let projection = d3.geoMercator().fitSize([width, height - marginBottom], ba);

  let path = d3.geoPath().projection(projection);

  //Set grid rectangle size 
  let randomRect = grid.features[100];
  let upLeft = randomRect.geometry.coordinates[0][0][1];
  let upRight = randomRect.geometry.coordinates[0][0][2];
  let rectSide = (projection(upRight)[0] - projection(upLeft)[0]) * 0.98;
  let rectCurve = 2.5;

    //Add grid
    let gridRects = chart.append("g")
            .attr("class", "grid")
            .selectAll("rect")
            .data(grid.features.filter(d => d.properties.budovy != null))
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
            .attr("fill", d => colorScale(d.properties.budovy))
            .attr("stroke", d => colorScale(d.properties.budovy));


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

        //Add mc outline
        chart.append("g")
        .attr("class", "mc")
        .selectAll("path")
        .data(mc.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", colors[0])
        .style("stroke-width", "0.7");

      //Add vulnerable spots
      function circleCoordinates(grid) {
        let upLeft = grid.geometry.coordinates[0][0][1];
        switch (grid.properties.vulnerable) {
          case 1:
            let x1 = projection(upLeft)[0] + (rectSide / 2)
            let y1 = projection(upLeft)[1] + (rectSide / 2)
            return [[x1, y1]];
          case 2:
            let x21 = projection(upLeft)[0] + (rectSide / 2) - 4
            let y21 = projection(upLeft)[1] + (rectSide / 2)
            let x22 = projection(upLeft)[0] + (rectSide / 2) + 4
            let y22 = projection(upLeft)[1] + (rectSide / 2) + 0.6
            return [[x21, y21], [x22, y22]];
          case 3:
            let x31 = projection(upLeft)[0] + (rectSide / 2) - 4
            let y31 = projection(upLeft)[1] + (rectSide / 2) + 2
            let x32 = projection(upLeft)[0] + (rectSide / 2) + 4
            let y32 = projection(upLeft)[1] + (rectSide / 2) + 2.6
            let x33 = projection(upLeft)[0] + (rectSide / 2) + 0.2
            let y33 = projection(upLeft)[1] + (rectSide / 2) - 4
            return [[x31, y31], [x32, y32], [x33, y33]];
          case 4:
            let x41 = projection(upLeft)[0] + (rectSide / 2) - 4
            let y41 = projection(upLeft)[1] + (rectSide / 2) + 2.4
            let x42 = projection(upLeft)[0] + (rectSide / 2) + 4
            let y42 = projection(upLeft)[1] + (rectSide / 2) + 3
            let x43 = projection(upLeft)[0] + (rectSide / 2) - 3.5
            let y43 = projection(upLeft)[1] + (rectSide / 2) - 4.2
            let x44 = projection(upLeft)[0] + (rectSide / 2) + 4.6
            let y44 = projection(upLeft)[1] + (rectSide / 2) - 3.6
            return [[x41, y41], [x42, y42], [x43, y43], [x44, y44]];
          default:
            return [[0, 0]];
        }
      }
      let vulnerablePlaces = chart.append("g")
            .attr("class", "vulnerable")
      
            let vulnerableGrids = grid.features.filter(d => d.properties.vulnerable !== 0);
            vulnerableGrids.forEach(grid => {
              console.log(grid.geometry);
              
              console.log(grid.properties.vulnerable);
              console.log(circleCoordinates(grid))

              circleCoordinates(grid).forEach(coordinates => {
                vulnerablePlaces.append("circle")
                  .attr("cx", coordinates[0])
                  .attr("cy", coordinates[1])
                  .attr("r", 3)
                  .attr("stroke", "white")
                  .attr("pointer-events", "none")
              });

            });

        //Add danube
        chart.append("g")
          .attr("class", "danube")
          .selectAll("path")
          .data(danube.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", "white")
          .style("stroke", "none")
          .style("stroke-width", "1.2");

        //Add danube outline
        chart.append("g")
        .attr("class", "danubeLine")
        .selectAll("path")
        .data(danubeLine.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", colors[0])
        .style("stroke-width", "1.2");

        //Add legend
        let legend = chart.append("g")
          .attr("class", "legend")

        legend.append("text")
          .attr("x", lgLeft)
          .attr("y", lgTop - 5)
            .style("font-size", "12px")
            .style("alignment-baseline", "hanging")
            .style("fill", "#878787")
          .append("tspan")
              .text("Počet budov ohrozených")
          .append("tspan")
              .text("intenzívnymi zrážkami")
              .attr("x", lgLeft)
              .attr("dy", 16)

        legend.selectAll("legendRects")
        .data(lgKeys)
        .enter()
        .append("rect")
            .attr("x", lgLeft)
            .attr("y", (d,i) => lgTop + (i+1)*lgHeight ) 
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 1.5)
            .attr("ry", 1.5)
            .style("fill", (d,i) => lgColors[i])
            .attr("pointer-events", "none");

        legend.selectAll("legendText")
        .data(lgKeys)
        .enter()
        .append("text")
            .attr("class", "numbers")
            .attr("x", lgLeft + 25)
            .attr("y", (d,i) => lgTop + (i+1)*lgHeight + 2) 
            .text(d => d)
            .style("font-size", "12px")
            .attr("pointer-events", "none")
            .style("alignment-baseline", "hanging"); 


        //Add interactivity
        gridRects.on("mousemove", function (event, d) {
          
          let budovyText;
          //Update the tooltip position and value
          if (d.properties.budovy === 1) {
            budovyText = 'budova'
          } else if (d.properties.budovy > 1 && d.properties.budovy <= 4) {
            budovyText = 'budovy'
          } else {
            budovyText = 'budov'
          }

          d3.select("#tooltip14")
              .style("left", (event.pageX + 10) + "px")
              .style("top", event.pageY + "px")				
              .select("#value14")
              .attr("class", "numbers")
              .text(d.properties.budovy.toFixed() + " " + budovyText);

          //Show the tooltip
          d3.select("#tooltip14").classed("hidden", false);

          //Add rect outline
          chart.append("rect")
            .attr("class", "temp")
            .attr("x", d3.select(this).attr("x"))
            .attr("y", d3.select(this).attr("y"))
            .attr("width", rectSide)
            .attr("height", rectSide)
            .attr("rx", d3.select(this).attr("rx"))
            .attr("ry", d3.select(this).attr("ry"))
            .attr("transform", d3.select(this).attr("transform"))
            .attr("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#eb897f")
            .style("stroke-width", "2")
            .attr("pointer-events", "none")

        }).on("mouseout", function() {
     
          //Hide the tooltip
          d3.select("#tooltip14").classed("hidden", true);
          
          //Delete the outline
          chart.selectAll(".temp").remove()
          
     })




  }


}