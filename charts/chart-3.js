 
var makeChart3 = function() {

    //Width and Height
    var w = 850;
    var h = 700;
    var margin = {bottom: 40}

    //Define quantize scale to sort data values into buckets of color
    var color = d3.scaleThreshold()
                .domain([2, 10, 18.5, 27, 35, 43])
                .range(["#E04E50", "#EB8A7F", "#F7D0C7", "#C6C2D8", "#948BB1", "#675C8D", "#231A57"]);

    //Define legend keys and position
    var keys = ["menej než 2%", "2-10%", "10-18,5%", "", "18,5-27%", "27-35%", "35-43%", "viac než 43%"];
    var lgColors = ["#E04E50", "#EB8A7F", "#F7D0C7", "none", "#C6C2D8", "#948BB1", "#675C8D", "#231A57"];
    var lgBottom = h * 0.83;
    var lgLeft = w * 0.09;
    var lgSpacing = 25;

    //Number formatting
    var commaFormat = function(num) {
        return d3.format(".1f")(num).replace(".", ",");
    }

    //Load census data
    Promise.all([
        d3.json("data/chart-3.geojson"),
        d3.json("data/okres.geojson"),
        d3.json("data/mc.geojson")
    ]).then(updateChart)

    function updateChart([data, okres, mc]) {

        //Define projection and path generator
        var projection = d3.geoMercator().fitSize([w, h - margin.bottom], mc);

        var path = d3.geoPath()
                    .projection(projection);
        
        //Set grid rectangle size 
        var randomRect = data.features[4500];
        var upLeft = randomRect.geometry.coordinates[0][0][1];
        var upRight = randomRect.geometry.coordinates[0][0][2];
        var rectSide = projection([upRight[0], upRight[1]])[0] - projection([upLeft[0], upLeft[1]])[0];
        var rectCurve = 1.5;

        //Create chart
        var chart = d3.select("#chart_3")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        //Add mestske casti polygons
        chart.append("g")
            .attr("class", "mc")
            .selectAll("path")
            .data(mc.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "#f6f6f6")
            .style("stroke", "white")
            .style("stroke-width", "2");

        //Add colored outlines for okresy
        chart.append("g")
            .attr("class", "okres")
            .selectAll("path")
            .data(okres.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "#DFDFDF")
            .style("stroke-width", "2");
        
        //Add all the data rectangles
        var grid = chart.append("g")
                .attr("class", "grid")
                .selectAll("rect")
                .data(data.features.filter(d => d.properties.plus65 != null))
                .enter()
                .append("rect")
                .attr("class", (d, i) => "not-" + (d.properties.plus65 > 18.5 ? "bottom" : "top"))
                .attr("x", function(d) {
                    var upLeft = d.geometry.coordinates[0][0][1];
                    return projection([upLeft[0], upLeft[1]])[0]
                }) 
                .attr("y", function(d) {
                    var upLeft = d.geometry.coordinates[0][0][1];
                    return projection([upLeft[0], upLeft[1]])[1]
                }) 
                .attr("width", rectSide) 
                .attr("height", rectSide) 
                .attr("rx", rectCurve)
                .attr("ry", rectCurve)
                .attr("transform", function(d) {
                    var upLeft = d.geometry.coordinates[0][0][1];
                    var center = [projection([upLeft[0], upLeft[1]])[0] + rectSide/2,
                                projection([upLeft[0], upLeft[1]])[1] + rectSide/2]
                    return "rotate(" + 5 + " " + center[0] + " " + center[1] + ")"
                })
                .attr("opacity", 1)
                .attr("fill", d => color(d.properties.plus65))
                .attr("stroke", d => color(d.properties.plus65))
                .attr("stroke-width", 0.2);

        //Add a legend together with background rectangles for interaction
        legend = chart.append("g")
                .attr("class", "legend")

        var legendRects = legend.append("g")
                                .attr("class", "legendRects")

        var legendText = legend.append("g")
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
                .attr("x", lgLeft + 20)
                .attr("y", (d,i) => lgBottom - i*lgSpacing) 
                .style("fill", "#231A57")
                .text(d => d)
                .style("font-family", "faktummedium")
                .style("font-size", "12px")
                .style("alignment-baseline", "hanging")
                .attr("pointer-events", "none");

            
        //Add average in middle of the legend
        legend.append("line")
                    .attr("x1", lgLeft)
                    .attr("y1", lgBottom - 3*lgSpacing + 5)
                    .attr("x2", lgLeft + 30)
                    .attr("y2", lgBottom - 3*lgSpacing + 5)
                    .attr("stroke", "#C6C2D8")
                    .attr("stroke-width", 2)
                    .attr("pointer-events", "none");

        legendText.append("text")
                    .attr("x", lgLeft + 40)
                    .attr("y", lgBottom - 3*lgSpacing + 5)
                    .style("fill", "#231A57")
                    .text("Bratislavský priemer: 18,5%")
                    .style("font-family", "faktummedium")
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
       var bgRects = legend.selectAll("rect")

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

