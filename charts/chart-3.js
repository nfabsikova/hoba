 
let makeChart3 = function() {

    //Width and Height
    let w = 850;
    let h = 700;
    let margin = {bottom: 40}

    //Define quantize scale to sort data values into buckets of color
    let color = d3.scaleThreshold()
                .domain([2, 10, 18.5, 27, 35, 43])
                .range(["#ef9c91", "#f4beb5", "#f9dfd9", "#c6c2d8", "#958bb1", "#53487c", "#241a57"]);

    //Define legend keys and position
    let keys = ["menej než 2%", "2-10%", "10-18,5%", "", "18,5-27%", "27-35%", "35-43%", "viac než 43%"];
    let lgColors = ["#ef9c91", "#f4beb5", "#f9dfd9", "none", "#c6c2d8", "#958bb1", "#53487c", "#241a57"];
    let colors = ["#F0F1F2", "#b2b2b2"]
    let lgBottom = h * 0.83;
    let lgLeft = w * 0.09;
    let lgSpacing = 25;

    //Number formatting
    let commaFormat = function(num) {
        return d3.format(".1f")(num).replace(".", ",");
    }

    //Load census data
    Promise.all([
        d3.json("data/chart-3.geojson"),
        d3.json("data/okres.geojson"),
        d3.json("data/mc.geojson"),
        d3.json("data/danube.geojson"),
        d3.json("data/danube-line.geojson")
    ]).then(updateChart)

    function updateChart([data, okres, mc, danube, danubeLine]) {
      console.log(danube)
        //Define projection and path generator
        let projection = d3.geoMercator().fitSize([w, h - margin.bottom], mc);

        let path = d3.geoPath()
                    .projection(projection);
        
        //Set grid rectangle size 
        let randomRect = data.features[4500];
        let upLeft = randomRect.geometry.coordinates[0][0][1];
        let upRight = randomRect.geometry.coordinates[0][0][2];
        let rectSide = projection([upRight[0], upRight[1]])[0] - projection([upLeft[0], upLeft[1]])[0];
        let rectCurve = 1.5;

        //Create chart
        let chart = d3.select("#chart_3")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        //Add okresy polygons
        chart.append("g")
            .attr("class", "okres")
            .selectAll("path")
            .data(okres.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", colors[0])
            .style("stroke", colors[1])
            .style("stroke-width", "1.2");

        
        //Add all the data rectangles
        let grid = chart.append("g")
                .attr("class", "grid")
                .selectAll("rect")
                .data(data.features.filter(d => d.properties.plus65 != null))
                .enter()
                .append("rect")
                .attr("class", (d, i) => "not-" + (d.properties.plus65 > 18.5 ? "bottom" : "top"))
                .attr("x", function(d) {
                    let upLeft = d.geometry.coordinates[0][0][1];
                    return projection([upLeft[0], upLeft[1]])[0]
                }) 
                .attr("y", function(d) {
                    let upLeft = d.geometry.coordinates[0][0][1];
                    return projection([upLeft[0], upLeft[1]])[1]
                }) 
                .attr("width", rectSide) 
                .attr("height", rectSide) 
                .attr("rx", rectCurve)
                .attr("ry", rectCurve)
                .attr("transform", function(d) {
                    let upLeft = d.geometry.coordinates[0][0][1];
                    let center = [projection([upLeft[0], upLeft[1]])[0] + rectSide/2,
                                projection([upLeft[0], upLeft[1]])[1] + rectSide/2]
                    return "rotate(" + 5 + " " + center[0] + " " + center[1] + ")"
                })
                .attr("opacity", 1)
                .attr("fill", d => color(d.properties.plus65))
                .attr("stroke", d => color(d.properties.plus65))
                .attr("stroke-width", 0.2);

        //Add mestske casti outlines
        chart.append("g")
          .attr("class", "mc")
          .selectAll("path")
          .data(mc.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", "none")
          .style("stroke", colors[1])
          .style("stroke-width", "0.7");

        //Add Danube
        chart.append("g")
          .attr("class", "danube")
          .selectAll("path")
          .data(danube.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", "white");

          chart.append("g")
            .attr("class", "danubeLine")
            .selectAll("path")
            .data(danubeLine.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", colors[1])
            .style("stroke-width", "1.2");



        //Add a legend together with background rectangles for interaction
        legend = chart.append("g")
                .attr("class", "legend")

        let legendRects = legend.append("g")
                                .attr("class", "legendRects")

        let legendText = legend.append("g")
                                .attr("class", "legendText")

        //Add legend
        legendRects.selectAll("legendRects")
            .data(keys)
            .enter()
            .append("rect")
                .attr("x", lgLeft)
                .attr("y", (d,i) => lgBottom - i*lgSpacing) 
                .attr("width", 12)
                .attr("height", 12)
                .attr("rx", rectCurve*2)
                .attr("ry", rectCurve*2)
                .style("fill", (d,i) => lgColors[i])
                .attr("pointer-events", "none");

        legendText.selectAll("legendText")
            .data(keys)
            .enter()
            .append("text")
                .attr("class", "numbers")
                .attr("x", lgLeft + 20)
                .attr("y", (d,i) => lgBottom - i*lgSpacing) 
                .text(d => d)
                .style("font-size", "12px")
                .style("alignment-baseline", "hanging")
                .attr("pointer-events", "none");

        legendText.append("text")
                    .attr("class", "numbers")
                    .attr("x", lgLeft)
                    .attr("y", lgBottom - 3*lgSpacing + 6)
                    .text("Bratislavský priemer: 18,5%")
                    .style("font-size", "12px")
                    .style("alignment-baseline", "middle")
                    .attr("pointer-events", "none");

        //Add bg legend rectangles for interaction -- change this to only two rects
        legend.append("rect")
                .attr("class", "top")
                .attr("x", lgLeft - 30)
                .attr("y",  lgBottom - keys.length * lgSpacing)
                .attr("width", 200)
                .attr("height", (keys.length - 2.8) * lgSpacing)
                .attr("fill", "black")
                .attr("stroke", "red")
                .attr("opacity", 0)

        legend.append("rect")
                .attr("class", "bottom")
                .attr("x", lgLeft - 30)
                .attr("y",  lgBottom - (keys.length - 5.2) * lgSpacing)
                .attr("width", 200)
                .attr("height", (keys.length - 3.8) * lgSpacing)
                .attr("fill", "black")
                .attr("stroke", "red")
                .attr("opacity", 0)

        //Add interactive tooltips and white rectangle outline
        grid.on("mouseover", function(event, d) {

            //Update the tooltip position and value
            d3.select("#tooltip3")
                .style("left", (event.pageX + 10) + "px")
                .style("top", event.pageY + "px")				
                .select("#value3")
                .attr("class", "numbers")
                .text(commaFormat(d.properties.plus65));
       
            //Show the tooltip
            d3.select("#tooltip3").classed("hidden", false);

            //Add black outline
            chart.append("rect")
                .attr("class", "temp")
                .attr("x", d3.select(this).attr("x"))
                .attr("y", d3.select(this).attr("y"))
                .attr("width", rectSide)
                .attr("height", rectSide)
                .attr("rx", d3.select(this).attr("rx"))
                .attr("ry", d3.select(this).attr("ry"))
                .attr("transform", d3.select(this).attr("transform"))
                .style("fill", "none")
                .style("stroke", "white")
                .attr("pointer-events", "none")

       })
       .on("mouseout", function() {
       
            //Hide the tooltip
            d3.select("#tooltip3").classed("hidden", true);
            
            //Delete the outline
            chart.select(".temp").remove()
            
       })

       //Add interactivity triggered by legend
       let bgRects = legend.selectAll("rect")

        bgRects.on("mouseover", function(event, d) {

            //Get category 
            //console.log(d3.select(this).attr("class"))

            //Turn off opacity for the other category
            chart.selectAll(".not-" + d3.select(this).attr("class"))
                .attr("opacity", "0")

        }).on("mouseout", function(event, d) {
            chart.select(".grid")
                .selectAll("rect")
                .attr("opacity", "1")

        })

    }

} 


