var makeChart6 = function() {
    console.log("hello")

    //Width, height and margins
    var margin = {left: 20}
    var mapHeight = 600, mapWidth = 480
    var chartHeight = 600, chartWidth = 320
    var barXStart = 155, barYStart = 180, barWidth = 110, barHeight = 320

    //Colors and pattern
    var colorScale = d3.scaleThreshold()
        .domain([1, 250, 500, 1500, 2250, 3500])
        .range(["#FFFFFF", "#E3DFEB", "#B9B2CC", "#948BB1", "#7D729D", "#53477D", "#2A2355"]);

    //Define legend keys and position
    var keys = ["", "250", "500", "1500", "2250", "3500"];
    var lgColors = ["#E3DFEB", "#B9B2CC", "#948BB1", "#7D729D", "#53477D", "#2A2355"];
    var lgBottom = mapHeight * 0.89;
    var lgLeft = mapWidth * 0.22;
    var lgWidth = 16;

    //Number formatting
    var commaFormat = d3.format(",");
    var spaceFormat = function(num) {
        return commaFormat(num).replace(/,/, " ");
    }


    //Load data
    Promise.all([
        d3.csv("data/chart-6.csv", d3.autoType),
        d3.json("data/chart-6-geo.geojson")
    ]).then(updateChart);

    function updateChart([data, geo]) {

        ////////////////////// MAP //////////////////////
        
        //Define projection and path generator
        var projection = d3.geoMercator().fitSize([mapWidth, mapHeight], geo);

        var path = d3.geoPath()
                    .projection(projection);

        //Create map svg
        var map = d3.select("#chart_6_map")
            .append("svg")
            .attr("class", "map")
            .attr("width", mapWidth)
            .attr("height", mapHeight)

        var polygons = map.append("g")
                            .attr("class", "polygons")

        //Add map data
        polygons.selectAll("path")
            .data(geo.features)
            .enter()
            .append("path")
                .attr("d", path)
                .attr("class", d => "i" + d.properties.IDN4)
                .attr("fill", function(d) {
                    if(d.properties.IDN3 < 106) {
                        return "#DADADA"
                    } else {
                        return colorScale(d.properties.flow)
                    }   
                })
                .style("stroke", function(d) {
                    if (d.properties.IDN3 == 103) { //check if Bratislava
                        return "#CECDCD"
                    } else {
                        return "#F0EEF5"
                    }     
                })
                .style("stroke-width", "0.8");

        //Add legend
        var legend = map.append("g")
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
                .attr("x", (d,i) => lgLeft + i*lgWidth)
                .attr("y", lgBottom) 
                .attr("width", lgWidth)
                .attr("height", 8)
                .style("fill", (d,i) => lgColors[i])
                .style("stroke", "white")
                .style("stroke-width", "1.2")
                .attr("pointer-events", "none");

        legendText.selectAll("legendText")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", (d, i) => lgLeft + i*lgWidth)
            .attr("y", (d,i) => lgBottom - 5 + (i % 2 == 0? 25 : 0)) 
            .style("fill", "#9C95B8")
            .text(d => d)
            .style("font-family", "faktummedium")
            .style("font-size", "10px")
            .attr("pointer-events", "none");



        //Add interactive tooltips
        map.selectAll("path").on("mousemove", function(event, d) {

            //Update the tooltip position and value
            d3.select("#tooltip6")
            .style("left", (event.pageX + 10) + "px")
            .style("top", event.pageY + "px")				
            .select("#value6")
            .text(d.properties.flow == null ? "NA" : spaceFormat(d.properties.flow));

            d3.select("#tooltip6")
            .select("#city6")
            .text(d.properties.NM4 + ": ")


            //Highlight obec and show tooltip if not Bratislava
            if(d.properties.IDN3 != 103) {

                d3.select(this).attr("fill", "#E04E50")

                d3.select("#tooltip6").classed("hidden", false);
            }


            //Add highlight to chart
            var currentIndex = this.getAttribute("class")

            bars.selectAll("rect." + currentIndex)
                .attr("fill", "#E04E50")
            

            
        }).on("mouseout", function(event, d) {

            var currentIndex = this.getAttribute("class")
            var currentFlow = d.properties.flow


            d3.select(this).attr("fill", d => d.properties.IDN3 == 103? "#DADADA" : colorScale(currentFlow))

            d3.select("#tooltip6").classed("hidden", true);

            //Remove highlight from chart
            bars.selectAll("rect." + currentIndex)
                .attr("fill", colorScale(currentFlow))

        })





        ////////////////////// CHART //////////////////////

            //Create chart group
            var chart = d3.select("#chart_6_chart")
                .append("svg")
                .attr("class", "chart")
                .attr("width", chartWidth)
                .attr("height", chartHeight)

            //Create scale functions
            var xScale = d3.scaleLinear()
                            .domain([0, 12000])
                            .range([0, barWidth])
                            

            var yScale = d3.scaleBand()
                            .domain(d3.range(data.length))
                            .range([0, barHeight])
                            .padding(.15)

            var bars = chart.append("g")
                            .attr("class", "bars")

            //create bars
            bars.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                    .attr("class", d => "i" + d.IDN4)
                    .attr("x", barXStart)
                    .attr("y", (d, i) => yScale(i) + barYStart)
                    .attr("width", d => xScale(d.flow))
                    .attr("height", yScale.bandwidth())
                    .attr("fill", d => colorScale(d.flow))

            //add a text label to the left of each bar
            var textLabels = chart.append("g")
                .attr("class", "textLabels")
            
            textLabels.selectAll("labels")
                .data(data)
                .enter()
                .append("text")
                    .attr("x", margin.left)
                    .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                    .text((d, i) => (i+1) + "  " + d.obec)
                        .style("font-size", "12px")
                        .style("fill", "#2A2355")

            //add a value label to the right of each bar
            var valueLabels = chart.append("g")
                .attr("class", "valueLabels")

            valueLabels.selectAll("labels")
                .data(data)
                .enter()
                .append("text")
                    .attr("x", d => barXStart + xScale(d.flow) + 2)
                    .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                    .text(d => spaceFormat(d.flow))
                        .style("font-size", "12px")
                        .style("fill", "#2A2355")

            //add bottom label
            chart.append("foreignObject")
                .attr("x", barXStart - 30)
                .attr("y", barYStart + barHeight)
                .attr("width", 150)
                .attr("height", 50)
                .attr("pointer-events", "none")
                .append("xhtml:body")
                    .style("font-size", "12px")
                    .style("color", "#9C95B8")
                    .style("font-family", "faktummedium")
                    .html("<p>80 604<br>z iných miest</p>")

            //add horizontal lines
            var lines = chart.append("g")
                .attr("class", "lines")

            lines.selectAll("line")
                .data(data)
                .enter()
                .append("line")
                    .attr("x1", margin.left)
                    .attr("x2", chartWidth)
                    .attr("y1", (d, i) => yScale(i) + barYStart + yScale.bandwidth() + 2)
                    .attr("y2", (d, i) => yScale(i) + barYStart + yScale.bandwidth() + 2)
                        .style("stroke", "#E5E5E5")
                        .style("stroke-width", "1.5")

            //add invisible rects for interaction
            var rects = chart.append("g")
                .attr("class", "rects")

            rects.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                    .attr("x", margin.left)
                    .attr("y", (d, i) => yScale(i) + barYStart)
                    .attr("width", chartWidth)
                    .attr("height", yScale.bandwidth() + 2)
                    .attr("opacity", 0)

            //add interactivity
            rects.selectAll("rect").on("mouseover", function(event, d) {
                
                var currentIndex = d.IDN4

                map.selectAll("path.i" + currentIndex)
                    .attr("fill", "#E04E50")

            }).on("mouseout", function(event, d) {

                var currentIndex = d.IDN4
                var currentFlow = d.flow

                map.selectAll("path.i" + currentIndex)
                    .attr("fill", colorScale(currentFlow))
            })

        ////////////////////// HEADER //////////////////////
        var header = chart.append("g")
                        .attr("class", "header")

        header.append("foreignObject")
            .attr("x", -20)
            .attr("y", -10)
            .attr("width", 350)
            .attr("height", 150)
            .attr("pointer-events", "none")
            .append("xhtml:body")
                .style("font-family", "faktummedium")
                .style("color", "#7E7E7D")
                .style("line-height", "1.5")
                .style("text-anchor", "start")
                .style("font-weight", "500")
                .style("font-size", "18px")
                .html("<p>138 557 SIM kariet denne prichádza<br>do Bratislavy z Bratislavského<br>a Trnavského kraja, 57 953 z nich<br>pochádza zo 14 miest</p>")

        header.append("line")
            .attr("x1", 10)
            .attr("x2", chartWidth)
            .attr("y1", 5)
            .attr("y2", 5)
                .style("stroke", "#7E7E7D")
                .style("stroke-width", 1.2)
                  
    }

}