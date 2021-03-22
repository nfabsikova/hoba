 
var makeChart1 = function() {

                //Width and Height
                var w = 800;
                var h = 400;
                var margin = {top: 80, right: 60, bottom: 40, left: 20}

                //Colors
                let colors = ["#231A57", "#E04E50"];
    
                //Background formating
                var background = {
                    values: [-2000, 0, 2000, 4000],
                    height: 1000
                };
                              
                //Axes formatting
                var labelYears = [0, 4, 9, 14, 19, 23];
                var commaFormat = d3.format(",");
                var spaceFormat = function(num) {
                    return commaFormat(num).replace(/,/, " ");
                }
    
                d3.csv("data/chart-1.csv", d3.autoType)
                    .then(dataIsReady);
    
                function dataIsReady(data) {
                    data = data.filter( function(data) {
                        return data.year >= 1996;
                    })
                      updateChart(data);
                    }
                
                function updateChart(data) {
    
                    //Create scale functions 
                    var x = d3.scaleBand()
                                    .domain(d3.range(data.length))
                                    .rangeRound([margin.left + 60, w - margin.right])
                                    .paddingInner(0.6);
    
                    var y = d3.scaleLinear()
                                .domain([-2000, 5000])
                                .rangeRound([h - margin.bottom, margin.top]);
                    
                    //Create axes
                    var xAxis = d3.axisTop()
                                    .scale(x)
                                    .tickValues(labelYears)
                                    .tickFormat(i => data[i].year);
    
                    var yAxis = d3.axisRight()
                                    .scale(y)
                                    .tickValues(background.values)
                                    .tickFormat(spaceFormat);
    
                    //Create chart
                    var chart = d3.select("#chart_1")
                                    .append("svg")
                                    .attr("width", w)
                                    .attr("height", h);
    
                     //Add background rectangles
                    for (element of background.values)   {
                            chart.append("rect")
                            .attr("x", margin.left)
                            .attr("y", y(element + background.height))
                            .attr("width", w - margin.right)
                            .attr("height", y(0) - y(background.height))
                            .attr("fill", "#f6f6f6");
                    } 
    
                    //Add gridlines
                    for (element of labelYears) {
                        chart.append("line")
                            .attr("x1", x(element) + x.bandwidth() / 2  + margin.left)
                            .attr("y1", 25)
                            .attr("x2", x(element) + x.bandwidth() / 2 + margin.left)
                            .attr("y2", h - margin.bottom)
                            .attr("stroke-width", "2")
                            .attr("stroke", "#f6f6f6")
                    }
                    
                    //Add groups
                    var groups = chart.selectAll("g")
                                    .data(data)
                                    .join("g")
    
                    //Add interactivity to groups
                        groups.on("mouseover", function(event, d) {

                            const e = groups.nodes();
                            const i = e.indexOf(this);
    
                                        //Highligh only current bar
                                        chart.selectAll("g")
                                        .selectAll("rect")
                                        .attr("opacity", "0.4")
                                        
                                        d3.select(this.childNodes[0])
                                        .attr("opacity", "1")

                                        //Create labels
                                        chart
                                            .append("text")
                                            .attr("class", "tooltip")
                                            .attr("x", x(i) + x.bandwidth() / 2)
                                            .attr("y", (d.increase > 0) ? (y(d.increase) - 28) : (y(d.increase) + 20))
                                            .attr("text-anchor", "start")
                                            .attr("pointer-events", "none")
                                            .attr("opacity", "0")
                                            .style("fill", (d.increase > 0) ? colors[0] : colors[1])
                                            .text((d.increase > 0 ? "+" + d.increase : d.increase));

                                        chart
                                            .append("text")
                                            .attr("class", "tooltip")
                                            .attr("x", x(i) + x.bandwidth() / 2)
                                            .attr("y", (d.increase > 0) ? (y(d.increase) - 12) : (y(d.increase) + 38))
                                            .attr("text-anchor", "start")
                                            .attr("pointer-events", "none")
                                            .attr("opacity", "0")
                                            .style("fill", (d.increase > 0) ? colors[0] : colors[1])
                                            .text("(" + d.year + ")");

                                        chart.selectAll(".tooltip")
                                            .attr("opacity", "1")
    
                                    })
                                    .on("mouseout", function(event, d) {
    
                                        //Highlight all bars
                                        chart.selectAll("g")
                                            .selectAll("rect")
                                            .attr("opacity", "1")
    
                                        //Remove tooltips
                                        chart.selectAll(".tooltip").remove();
                                    });
    
                    //Add bars
                    bars = groups
                        .append("rect")
                        .attr("class", "bars")
                        .attr("x", (d, i) => x(i) + margin.left)
                        .attr("y", d => y(Math.max(d.increase, 0)))
                        .attr("width", x.bandwidth())
                        .attr("height", d => Math.abs(y(d.increase)- y(0)))
                        .attr("fill", d => (d.increase > 0 ? colors[0] : colors[1]))
                        .attr("opacity", "1");
    
                    //Add invisible rectangles
                    groups
                        .append("rect")
                        .attr("x", (d, i) => x(i) - x.bandwidth() / 2 + margin.left - 4)
                        .attr("y", 0)
                        .attr("width", x.bandwidth() * 2.5)
                        .attr("height", h)
                        .attr("fill", "none")
                        .attr("pointer-events", "all");
                        
                    //Add axes
                    chart.append("g")
                        .attr("class", "xAxis")
                        .attr("transform", "translate (0, " + 25 + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .attr("transform", "translate (" + (x.bandwidth() + 10) + ", 0)")
                            .attr("text-anchor", "start")
                            .attr("pointer-events", "none");
                        
                    chart.append("g")
                        .attr("class", "yAxis")
                        .call(yAxis)
                        .selectAll("text")
                            .attr("transform", "translate (" + (margin.left - 6) + ",-6)");
                    }
} 


