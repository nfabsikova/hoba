var makeChart4 = function() {

        //Width, height and columns for chart
        var svgHeight = 40, svgWidth = 550;
        var colStart = [0, 160, 380]

        //Width, height and margins for map
        var mapHeight = 350, mapWidth = 250
        var mapMargin = {right: 30}

        //Width, height and margins for header
        var headerHeight = svgHeight * 1.2
        var headerWidth = svgWidth + mapWidth
        var headerCols = [0, 250, 410, 630, 820]
        var headerTexts = ["Zastúpenie žien<br>vo veku 65+", "mestská časť", "podiel žien<br>vo veku 65+", "zmena v čase<br>(1996-2019)"]

        //Colors and pattern
        var colors = ["#231A57", "#E2DFEB", "#E9E9E9", "#241B57", "#C6C6C5"]
        var colorScale = d3.scaleThreshold()
            .domain([8, 10, 12, 15])
            .range(["#E2DFEB", "#C6C2D8", "#7D729D", "#53477D", "#231A57"]);

        //Number formatting
        var commaFormat = function(num) {
            return d3.format(".1f")(num).replace(".", ",");
        }

        //Load data
        Promise.all([
            d3.csv("data/chart-4.csv", d3.autoType),
            d3.json("data/mc.geojson")
        ]).then(updateChart);

        function updateChart([data, geo]) {
            console.log(data, geo)

            ////////////////////// HEADER //////////////////////

            //Add header svg
            var header = d3.select("#chart_4_header")
                            .append("svg")
                            .attr("class", "header")
                            .attr("width", headerWidth)
                            .attr("height", headerHeight)

            //Add groups
            var headerLines = header.append("g")
                                    .attr("class", "lines")

            var headerLabels = header.append("g")
                                .attr("class", "labels")

            
            //Add horizontal lines and texts
            headerCols.forEach(function(d, i) {

                if (i < 4) {
                    headerLines.append("line")
                    .attr("x1", d)
                    .attr("x2", headerCols[i + 1] - 40)
                    .attr("y1", 0)
                    .attr("y2", 0)
                    .attr("stroke", colors[4])
                    .attr("stroke-width", 3.5)

                var currentCol = i

                headerLabels
                    .append("foreignObject")
                    .attr("x", d - 30)
                    .attr("y", 0)
                    .attr("width", 200)
                    .attr("height", 50)
                    .attr("pointer-events", "none")
                    .append("xhtml:body")
                        .attr("class", "headerLabel")
                        .style("font-size", function(d,i) {return (currentCol == 0 ? "18px" : "12px")})
                        .style("font-family", "ff-real-text-pro, sans-serif")
                        .style("color", "#7E7E7D")
                        .style("line-height", "1.2")
                        .style("text-anchor", "start")
                        .style("font-weight", "500")
                        .html(headerTexts[i])
                }


            })


            ////////////////////// MAP //////////////////////
            
            //Define projection and path generator
            var projection = d3.geoMercator().fitSize([mapWidth - mapMargin.right, mapHeight], geo);

            var path = d3.geoPath()
                        .projection(projection);

            //Create map svg
            var map = d3.select("#chart_4_map")
                .append("svg")
                .attr("class", "map")
                .attr("width", mapWidth)
                .attr("height", mapHeight)

            //Add mestske casti polygons
            map.selectAll("path")
                .data(geo.features)
                .enter()
                .append("path")
                    .attr("d", path)
                    .attr("class", d => "i" + d.properties.index)
                    .attr("fill", d => colorScale(d.properties.share))
                    .style("stroke", "white")
                    .style("stroke-width", "1");
                


            ////////////////////// CHART //////////////////////

            //Create chart group
            var chart = d3.select("#chart_4_chart")
                .append("g")
                .attr("class", "chart")


            // Create scale functions
                var xScale = d3.scaleLinear()
                .domain([
                    d3.min(data, d => d.year),
                    d3.max(data, d => d.year)
                ])
                .range([colStart[2], colStart[2] + 100]);

                var xScaleRect = d3.scaleLinear()
                .domain([0, 20])
                .range([colStart[0], colStart[1]])
        
                var yScale = d3.scaleLinear()
                    .domain([0, 20])
                    .range([svgHeight - 5, 5]);
        
            // Create line and area generators

            var currentYear = 2019

               var line = d3.line()
                    .x(d => xScale(d.year))
                    .y(d => yScale(d.share))

                var area = d3.area()
                    .x(d => xScale(d.year))
                    .y1( d => yScale(d.share))
                    .y0(d => yScale(0))


                //Group data
                var dataGrouped = d3.group(data, d => d.area)

 
                
                // Treat an svg just like we would a circle - add one for every single data point
                dataGrouped.forEach(function(d, i) {

                    var currentArea = i

                    //Create svg for each area
                    var svg = chart
                        .append("svg")
                        .datum(d)
                        .attr("class", i)
                        .attr("width", svgWidth)
                        .attr("height", svgHeight)
                        .style("vertical-align", "top");

                    //Add pattern for Bratislava
                    if (currentArea == "Bratislava") {

                        var defs = svg.append("defs")
    
                        var pattern = defs
                            .append("pattern")
                            .attr("id", "chart4-hash")
                            .attr("height", 6)
                            .attr("width", 12)
                            .attr("patternUnits", "userSpaceOnUse")
                            .attr("patternTransform", "rotate(-45)");

                        pattern
                            .append("rect")
                            .attr("height", "6")
                            .attr("width", "20")
                            .attr("opacity", "1")
                            .attr("fill", "white");
                
                        pattern
                            .append("rect")
                            .attr("height", "6")
                            .attr("width", "8")
                            .attr("opacity", "1")
                            .attr("fill", "#E2DFEB");
                    }

                    //Create groups

                    var labels = svg.append("g")
                        .attr("class", "labels")

                    var barChart = svg.append("g")
                        .attr("class", "barChart")

                    var lineChart = svg.append("g")
                        .attr("class", "lineChart")

                    //Add area text label
                    labels.append("text")
                        .attr('x', colStart[0])
                        .attr('y', svgHeight - 5)
                        .text(currentArea)
                        .style("fill", colors[3])
                        .style("font-size", "12px")

                    //Add background rect
                    barChart.append("rect")
                        .attr("x", colStart[1])
                        .attr("y", function() {return currentArea == "Bratislava"? 20: 0})
                        .attr("width", d => xScaleRect(11.2))
                        .attr("height", svgHeight)
                        .attr("fill", "#F6F6F6")
                        .style("stroke", "#F6F6F6")
                        .style("stroke-width", 1.5)

                    //Add bars
                    barChart.append("rect")
                        .datum(d.filter(d => d.year == 2019))
                        .attr("x", colStart[1])
                        .attr("y", 17)
                        .attr("width", d => xScaleRect(d[0].share))
                        .attr("height", 19)
                        .attr("class", d => "rect" + d[0].index)
                        .attr("fill", function(d) {return currentArea == "Bratislava" ? "url('#chart4-hash')" : colorScale(d[0].share)})
                        .style("stroke", colors[0])
                        .style("stroke-width", 1.5)

                    //Add bar label
                    barChart.append("text")
                        .datum(d.filter(d => d.year == 2019))
                        .attr("x", d => colStart[1] + 5 + xScaleRect(d[0].share))
                        .attr("y", 35)
                        .attr("class", "numbers")
                        .text(d => commaFormat(d[0].share) + "%")
                        .style("fill", colors[3])
                        .style("font-size", "12px")

                    //Add horizontal line
                    svg.append("line")
                        .attr("x1", 0)
                        .attr("x2", svgWidth - 20)
                        .attr("y1", svgHeight)
                        .attr("y2", svgHeight)
                        .attr("stroke", colors[2])
                        .attr("stroke-width", 2.5)

                    //Add (initially hidden) year label to Bratislava svg
                    if (currentArea == "Bratislava") {
                        lineChart.append("text")
                            .attr("class", "yearLabel numbers")
                            .attr("x", xScale(2019))
                            .attr("y", 11)
                            .text("2010")
                            .attr("opacity", 0)
                            .style("fill", colors[3])
                            .style("text-align", "center")
                            .style("font-size", "14px")
                    } 

                    //Add two areas - one static, one dynamic
                    lineChart.append("path")
                        .attr("class", "pathStatic")
                        .attr("fill", function() {return currentArea == "Bratislava"? "url('#chart4-hash')" : colors[1]})
                        .attr("stroke", "none")
                        .attr("d", area)
                        .style("pointer-events", "none");
 
                    lineChart.append("path")
                        .attr("class", "areaDynamic" + d[0].index)
                        .attr("fill", function() {return currentArea == "Bratislava"? "url('#chart4-hash')" : colors[1]})
                        .attr("stroke", "none")
                        .attr("d", area)
                        .style("pointer-events", "none");


                    //Add two lines - one static, one dynamic
                    lineChart.append("path")
                        .attr("class", "pathStatic")
                        .attr("fill", "none")
                        .attr("stroke", colors[0])
                        .attr("stroke-width", "3")
                        .attr("d", line)
                        .style("pointer-events", "none");

                    lineChart.append("path")
                        .attr("class", "lineDynamic" + d[0].index)
                        .attr("fill", "none")
                        .attr("stroke", colors[0])
                        .attr("stroke-width", "3")
                        .attr("d", line)
                        .style("pointer-events", "none");


                    //Add circle at the end of the line
                    lineChart.append("circle")
                        .datum(d)
                        .attr("cx", xScale(2019))
                        .attr("cy", d => yScale(d[23].share))
                        .attr("r", 3.5)
                        .attr("fill", colors[0])
                        .style("pointer-events", "none");

                    //Add line chart labels
                    lineChart.append("text")
                        .datum(d.filter(d => d.year == 1996))
                        .attr("class", "numbers")
                        .attr("x", colStart[2] - 5)
                        .attr("y", d => yScale(d[0].share) + 7)
                        .text(d => commaFormat(d[0].share))
                        .style("fill", colors[3])
                        .style("font-size", "12px")
                        .style("text-anchor", "end")

                    lineChart.append("text")
                        .datum(d)
                        .attr("class", "textDynamic numbers")
                        .attr("x", colStart[2] + 107)
                        .attr("y", d => yScale(d[23].share) + 7)
                        .text(d => commaFormat(d[23].share) + "%")
                        .style("fill", colors[3])
                        .style("font-size", "12px")

                    //Add rects for interaction
                    lineChart.append("rect")
                        .attr("class", "rectInteract")
                        .attr("x", colStart[2])
                        .attr("y", 0)
                        .attr("width", 100)
                        .attr("height", svgHeight)
                        .attr("opacity", "0")
                        .attr("pointer-events", "all")

                        
                })


                //Add interaction

                //Map highlights
                chart.selectAll("svg").on("mouseover", function(event, d) {

                    var currentIndex = d[0].index

                    map.selectAll("path." + currentIndex)
                        .attr("fill", "#E04E50")


                }).on("mouseout", function(event, d) {

                    map.selectAll("path")
                        .attr("fill", d => colorScale(d.properties.share))

                })

                //Barchart highlights
                map.selectAll("path").on("mouseover", function(event, d) {

                    var currentIndex = "i" + d.properties.index
                    
                    chart.selectAll(".rect" + currentIndex)
                        .attr("fill", "#E04E50")

                }).on("mouseout", function(event, d) {

                    var currentIndex = "i" + d.properties.index

                    chart.selectAll(".rect" + currentIndex)
                    .attr("fill", d => colorScale(d[0].share))
                })


                //Linechart details

                 // This allows to find the closest X index of the mouse:
                var bisect = d3.bisector(d => d.year).left;

                chart.selectAll("svg").selectAll(".rectInteract").on("mousemove", function(event, d) {

                     // recover coordinates we need
                    currentYear = Math.round(xScale.invert(d3.pointer(event)[0]))
                    var i = bisect(d, currentYear)

                    chart.selectAll("circle")
                        .attr("cx", xScale(currentYear))
                        .attr("cy", d => yScale(d[i].share))

                    chart.selectAll(".textDynamic")
                        .text(d => commaFormat(d[i].share) + "%")

                    chart.selectAll(".pathStatic")
                        .attr("opacity", "0.4")

                    chart.select(".yearLabel")
                        .attr("opacity", "1")
                        .attr("x", xScale(currentYear))
                        .text(currentYear)
                    
                    dataGrouped.forEach(function(d) {

                        dataFiltered = d.filter(d => d.year <= currentYear)

                        chart.select(".lineDynamic" + d[0].index)
                            .datum(dataFiltered)
                            .attr("d", line)

                        chart.select(".areaDynamic" + d[0].index)
                            .datum(dataFiltered)
                            .attr("d", area)

                    })

                }).on("mouseout", function(event, d) {

                    chart.select(".yearLabel")
                        .attr("opacity", "0")

                }) 

            }

}
