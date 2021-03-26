let makeChart4 = function() {

        //Width, height and columns for chart
        let svgHeight = 40, svgWidth = 500;
        let colStart = [0, 145, 355]
        let colEnd = [115, 325, 500]


        //Width, height and margins for map
        let mapHeight = 350, mapWidth = 250
        let mapMargin = {right: 30}

        //Width, height and margins for header
        let headerHeight = svgHeight * 1.2
        let headerWidth = svgWidth + mapWidth
        let headerTexts = ["mestská časť", "podiel žien<br>vo veku 65+", "zmena v čase<br>(1996-2019)"]

        //Colors and pattern
        let colors = ["#241b58", "#d4d4d4", "#878787", "#e2dfeb", "#f4f4f4"]
        let colorScale = d3.scaleThreshold()
            .domain([8, 10, 12, 15])
            .range(["#e2dfeb", "#c6c2d8", "#948bb0", "#685c8c", "#241b58"]);

        //Number formatting
        let commaFormat = function(num) {
            return d3.format(".1f")(num).replace(".", ",");
        }

        //Load data
        Promise.all([
            d3.csv("data/chart-4.csv", d3.autoType),
            d3.json("data/mc.geojson"),
            d3.json("data/ba.geojson"),
            d3.json("data/danube.geojson"),
            d3.json("data/danube-line.geojson")
        ]).then(updateChart);

        function updateChart([data, mc, okres, danube, danubeLine]) {

            ////////////////////// MAP //////////////////////
            
            //Define projection and path generator
            let projection = d3.geoMercator().fitSize([mapWidth - mapMargin.right, mapHeight], mc);

            let path = d3.geoPath()
                        .projection(projection);

            //Create map svg
            let map = d3.select("#chart_4_map")
                .append("svg")
                .attr("class", "map")
                .attr("width", mapWidth)
                .attr("height", mapHeight)

            //Add mestske casti polygons
            map.selectAll("path.mc")
                .data(mc.features)
                .enter()
                .append("path")
                    .attr("d", path)
                    .attr("class", d => "i" + d.properties.index)
                    .attr("fill", d => colorScale(d.properties.share))
                    .style("stroke", "white")
                    .style("stroke-width", "0.6");

            //Add okresy outlines
            map.selectAll("path.okres")
              .data(okres.features)
              .enter()
              .append("path")
                  .attr("d", path)
                  .attr("fill", "none")
                  .style("stroke", colors[0])
                  .style("stroke-width", "0.8");

            //Add Danube
            map.selectAll("path.danube")
              .data(danube.features)
              .enter()
              .append("path")
                  .attr("d", path)
                  .attr("fill", "white");

            //Add Danube outline
            map.selectAll("path.danube")
              .data(danubeLine.features)
              .enter()
              .append("path")
                  .attr("d", path)
                  .attr("fill", "none")
                  .style("stroke", colors[0])
                  .style("stroke-width", "0.8");
                  
                  


            ////////////////////// CHART //////////////////////

            //Create chart group
            let chart = d3.select("#chart_4_chart")
                .append("g")
                .attr("class", "chart")


            // Create scale functions
                let xScale = d3.scaleLinear()
                .domain([
                    d3.min(data, d => d.year),
                    d3.max(data, d => d.year)
                ])
                .range([colStart[2], colStart[2] + 100]);

                let xScaleRect = d3.scaleLinear()
                .domain([0, 18])
                .range([colStart[0], colStart[1]])
        
                let yScale = d3.scaleLinear()
                    .domain([0, 20])
                    .range([svgHeight - 5, 5]);
        
            // Create line and area generators

            let currentYear = 2019

               let line = d3.line()
                    .x(d => xScale(d.year))
                    .y(d => yScale(d.share))

                let area = d3.area()
                    .x(d => xScale(d.year))
                    .y1( d => yScale(d.share))
                    .y0(d => yScale(0))

            //Add header svg
            let header = chart.append("svg")
                .attr("class", "header")
                .attr("width", svgWidth)
                .attr("height", svgHeight * 1.5);

            //Add header lines and labels
            colStart.forEach(function(d, i) {

                  header
                    .append("line")
                    .attr("x1", colStart[i])
                    .attr("x2", colEnd[i])
                    .attr("y1", 0)
                    .attr("y2", 0)
                    .attr("stroke", colors[2])
                    .attr("stroke-width", 3)

                  header
                    .append("foreignObject")
                    .attr("x", colStart[i])
                    .attr("y", -5)
                    .attr("width", 200)
                    .attr("height", 50)
                    .attr("pointer-events", "none")
                    .append("xhtml:p")
                        .attr("class", "headerLabel")
                        .style("font-family", "ff-real-text-pro, sans-serif")
                        .style("font-size", "12px")
                        .style("color", "#7E7E7D")
                        .style("line-height", "1.2")
                        .style("text-anchor", "start")
                        .html(headerTexts[i])

            });

            //Add (initially hidden) year label to header
              header.append("text")
                  .attr("class", "yearLabel numbers")
                  .attr("x", 0)
                  .attr("y", 60)
                  .text("2010")
                  .attr("opacity", 0)
                  .style("fill", colors[0])
                  .style("text-align", "center")
                  .style("font-size", "14px")

            //Group data
            let dataGrouped = d3.group(data, d => d.area)


            let counter = 0;
            // Treat an svg just like we would a circle - add one for every single data point
            dataGrouped.forEach(function(d, i) {

                let currentArea = i
                

                //Create svg for each area
                let svg = chart
                    .append("svg")
                    .datum(d)
                    .attr("class", i)
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .style("vertical-align", "top")
                    .style("background-color", counter % 2 == 0 ? "white" : colors[4]);

                counter += 1;

                //Create groups

                let labels = svg.append("g")
                    .attr("class", "labels")

                let barChart = svg.append("g")
                    .attr("class", "barChart")

                let lineChart = svg.append("g")
                    .attr("class", "lineChart")

                //Add area text label
                labels.append("text")
                    .attr('x', colStart[0])
                    .attr('y', svgHeight - 5)
                    .text(currentArea)
                    .style("fill", function() {return currentArea == "Bratislava" ? colors[2] : colors[0]})
                    .style("font-size", "12px")

                //Add bars
                barChart.append("rect")
                    .datum(d.filter(d => d.year == 2019))
                    .attr("x", colStart[1])
                    .attr("y", 17)
                    .attr("width", d => xScaleRect(d[0].share))
                    .attr("height", 19)
                    .attr("class", d => "rect" + d[0].index)
                    .attr("fill", currentArea == "Bratislava" ? colors[1] : colorScale(d[23].share))
                    .style("stroke", currentArea == "Bratislava" ? colors[2] : colors[0])
                    .style("stroke-width", "0.8")

                //Add bar label
                barChart.append("text")
                    .datum(d.filter(d => d.year == 2019))
                    .attr("x", d => colStart[1] + 5 + xScaleRect(d[0].share))
                    .attr("y", 35)
                    .attr("class", "numbers")
                    .text(d => commaFormat(d[0].share) + "%")
                    .style("fill", currentArea == "Bratislava" ? colors[2] : colors[0])
                    .style("font-size", "12px")

                //Add two areas - one static, one dynamic
                lineChart.append("path")
                    .attr("class", "pathStatic")
                    .attr("fill", currentArea == "Bratislava"? colors[1] : colors[3])
                    .attr("stroke", "none")
                    .attr("d", area)
                    .style("pointer-events", "none");

                lineChart.append("path")
                    .attr("class", "areaDynamic" + d[0].index)
                    .attr("fill", currentArea == "Bratislava"? colors[1] : colors[3])
                    .attr("stroke", "none")
                    .attr("d", area)
                    .style("pointer-events", "none");


                //Add two lines - one static, one dynamic
                lineChart.append("path")
                    .attr("class", "pathStatic")
                    .attr("fill", "none")
                    .attr("stroke", currentArea == "Bratislava" ? colors[2] : colors[0])
                    .attr("stroke-width", "1.5")
                    .attr("d", line)
                    .style("pointer-events", "none");

                lineChart.append("path")
                    .attr("class", "lineDynamic" + d[0].index)
                    .attr("fill", "none")
                    .attr("stroke", currentArea == "Bratislava" ? colors[2] : colors[0])
                    .attr("stroke-width", "1.5")
                    .attr("d", line)
                    .style("pointer-events", "none");


                //Add circle at the end of the line
                lineChart.append("circle")
                    .datum(d)
                    .attr("cx", xScale(2019))
                    .attr("cy", d => yScale(d[23].share))
                    .attr("r", 4)
                    .attr("fill", currentArea == "Bratislava" ? colors[2] : colors[0])
                    .attr("stroke", "white")
                    .attr("stroke-width", "1.5")
                    .style("pointer-events", "none");

                //Add line chart labels
                lineChart.append("text")
                    .datum(d.filter(d => d.year == 1996))
                    .attr("class", "numbers")
                    .attr("x", colStart[2] - 5)
                    .attr("y", d => yScale(d[0].share) + 7)
                    .text(d => commaFormat(d[0].share))
                    .style("fill", currentArea == "Bratislava" ? colors[2] : colors[0])
                    .style("font-size", "12px")
                    .style("text-anchor", "end")

                lineChart.append("text")
                    .datum(d)
                    .attr("class", "textDynamic numbers")
                    .attr("x", colStart[2] + 107)
                    .attr("y", d => yScale(d[23].share) + 7)
                    .text(d => commaFormat(d[23].share) + "%")
                    .style("fill", currentArea == "Bratislava" ? colors[2] : colors[0])

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

                let currentIndex = d[0].index

                map.selectAll("path." + currentIndex)
                    .attr("fill", "#eb897f")


            }).on("mouseout", function(event, d) {

              let currentIndex = d[0].index

                map.selectAll("path." + currentIndex)
                    .attr("fill", d => colorScale(d.properties.share))

            })

            //Barchart highlights
            map.selectAll("path").on("mouseover", function(event, d) {

                let currentIndex = "i" + d.properties.index
                
                chart.selectAll(".rect" + currentIndex)
                    .attr("fill", "#eb897f")

            }).on("mouseout", function(event, d) {

                let currentIndex = "i" + d.properties.index

                chart.selectAll(".rect" + currentIndex)
                .attr("fill", d => colorScale(d[0].share))
            })


            //Linechart details

              // This allows to find the closest X index of the mouse:
            let bisect = d3.bisector(d => d.year).left;

            chart.selectAll("svg").selectAll(".rectInteract").on("mousemove", function(event, d) {

                  // recover coordinates we need
                currentYear = Math.round(xScale.invert(d3.pointer(event)[0]))
                let i = bisect(d, currentYear)

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

            })

        }

}
