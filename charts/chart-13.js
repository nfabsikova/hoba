export function makeChart13(mc, ba, grid, gridBg, danube, danubeLine) {

    // *** CHART SETTINGS ***

    let footnote = "Ohrozenie horúčavami podľa štvorcov 1x1km Zdroj: USGS/NASA Landsat 8 Program, 2018. Spracoval: Útvar hlavnej architektky, Hlavné mesto SR Bratislava 2020.";

    //Width and Height
    let width = 800;
    let height = 700;
    let marginBottom = 60;

    //Colors
    let colors = ["#878787"];

    //Define quantize scale to sort data values into buckets of color
    let colorScale = d3.scaleThreshold()
                .domain([22, 25, 28, 31, 34, 37, 40, 49])
                .range(["#ffffff", "#fdf0ec", "#f9dfd9", "#f7d0c7", "#f4beb5", "#ef9c91", "#e8776f", "#e14e51"]);

    //Define legend keys and position
    let lgKeys = ["22–25°C", "25–28°C", "28–31°C", "31–34°C", "34–37°C", "37–40°C", "40–49°C"].reverse();
    let lgColors = ["#fdf0ec", "#f9dfd9", "#f7d0c7", "#f4beb5", "#ef9c91", "#e8776f", "#e14e51"].reverse();
    let lgTop = height * 0.5;
    let lgLeft = width * 0.12;
    let lgHeight = 25;

    // *** END OF SETTINGS ***

    //Add all chart elements

    d3.select("#chart13").append("div").attr("id", "chart13_container");

    //Create svg
      let chart = d3.select("#chart13_container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //Create tooltip
    let tooltip = d3.select("#chart13_container").append("div").attr("id", "tooltip13").attr("class", "hidden");
    tooltip.append("p").append("span").attr("id", "value13").attr("class", "numbers").text(100);

    //Create footnote
    d3.select("#chart13").append("hr");
    d3.select("#chart13").append("p").attr("class", "footnote").text(footnote)

    //Load forrest area
    Promise.all([
      d3.json("./data/lesy.geojson"),
      d3.json("./data/chart-13-labels.geojson")
    ]).then(updateChart)

    function updateChart([lesy, labels]) {
    //Define projection and path generator

    let projection = d3.geoMercator().fitSize([width, height - marginBottom], ba);

    let path = d3.geoPath().projection(projection);


    //Set grid rectangle size 
    let randomRect = grid.features[100];
    let upLeft = randomRect.geometry.coordinates[0][0][1];
    let upRight = randomRect.geometry.coordinates[0][0][2];
    let rectSide = (projection(upRight)[0] - projection(upLeft)[0]) * 0.98;
    let rectCurve = 2.5;

    //Define forest pattern
    var defs = chart.append("defs")

    var pattern = defs
        .append("pattern")
        .attr("id", "hash")
        .attr("height", 6)
        .attr("width", 6)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(-45)");

    pattern
        .append("rect")
        .attr("height", "6")
        .attr("width", "0.8")
        .attr("opacity", "1")
        .attr("fill", "#7e739e");

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

          //Add forests
          chart.append("g")
              .attr("class", "lesy")
              .selectAll("path")
              .data(lesy.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("pointer-events", "none")
              .style("fill", "url('#hash')")
              .style("stroke", "#7e739e");


          //Add labels
          let labelCircles = chart.append("g")
              .attr("class", "labelCircles")
              .selectAll("circle")
              .data(labels.features)
              .enter()
              .append("circle")
              .attr("cx", d => projection(d.geometry.coordinates)[0])
              .attr("cy", d => projection(d.geometry.coordinates)[1])
              .attr("r", 9)
              .attr("fill", "#241b58");

              chart.append("g")
              .attr("class", "labelText")
              .selectAll("text")
              .data(labels.features)
              .enter()
              .append("text")
              .attr("x", d => projection(d.geometry.coordinates)[0] - 3.5)
              .attr("y", d => projection(d.geometry.coordinates)[1] + 3)
              .text((d, i) => i + 1)
              .attr("pointer-events", "none")
              .style("fill", "white")
              .style("font-size", "12px");



          //Add legend
          let legend = chart.append("g")
            .attr("class", "legend")

          legend.append("text")
            .attr("x", lgLeft)
            .attr("y", lgTop)
            .text("Teplota povrchov")
              .style("font-size", "12px")
              .style("alignment-baseline", "hanging")
              .style("fill", "#878787");

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

          legend.append("rect")
              .attr("x", lgLeft)
              .attr("y", lgTop + ((lgKeys.length + 2) * lgHeight))
              .attr("width", 14)
              .attr("height", 14)
              .attr("rx", 1.5)
              .attr("ry", 1.5)
              .style("fill", "url('#hash')")
              .style("stroke", "#7e739e");

          legend.append("text")
              .attr("class", "numbers")
              .attr("x", lgLeft + 25)
              .attr("y", lgTop + ((lgKeys.length + 2) * lgHeight)) 
              .text("lesy")
              .style("font-size", "12px")
              .attr("pointer-events", "none")
              .style("alignment-baseline", "hanging"); 

          //Add forest
          chart.append("img")  
            .attr("src","../SVG/forest.svg")
            .attr("width", 1000)
            .attr("height", 800)


          //Add interactivity
          gridRects.on("mousemove", function (event, d) {
            
            //Update the tooltip position and value
            d3.select("#tooltip13")
                .style("left", (event.pageX + 10) + "px")
                .style("top", event.pageY + "px")				
                .select("#value13")
                .attr("class", "numbers")
                .text(d.properties.temp.toFixed() + "°C");

            //Show the tooltip
            d3.select("#tooltip13").classed("hidden", false);

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
              .style("stroke", "#241b58")
              .style("stroke-width", "2")
              .attr("pointer-events", "none")

          }).on("mouseout", function() {
       
            //Hide the tooltip
            d3.select("#tooltip13").classed("hidden", true);
            
            //Delete the outline
            chart.selectAll(".temp").remove()
            
       })

       labelCircles.on("mouseover", function(event, d) {
         console.log(d.properties.popis);

        //Update the tooltip position and value
        d3.select("#tooltip13")
        .style("left", (event.pageX + 10) + "px")
        .style("top", event.pageY + "px")				
        .select("#value13")
        .attr("class", "numbers")
        .text(d.properties.popis);

        //Show the tooltip
        d3.select("#tooltip13").classed("hidden", false);

       }).on("mouseout", function() {
         
        //Hide the tooltip
        d3.select("#tooltip13").classed("hidden", true);

       })




    }


}