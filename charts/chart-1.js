 
export function makeChart1() {

    //Width and Height
    let w = 800;
    let h = 400;
    let margin = {top: 35, right: 0, bottom: 40, left: 0}

    //Colors
    let colors = ["#241b58", "#e14e50", "#f4f4f4", "#d4d4d4"];

    //Background formating
    let background = {
        values: [-2000, 0, 2000, 4000],
        height: 1000
    };
                  
    //Axes formatting
    let labelYears = [0, 4, 9, 14, 19, 23];
    let commaFormat = d3.format(",");
    let spaceFormat = function(num) {
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
          let xScale = d3.scaleBand()
                          .domain(d3.range(data.length + 1))
                          .rangeRound([80, w - margin.right])
                          .paddingInner(0.4);

          let yScale = d3.scaleLinear()
                      .domain([-2000, 5000])
                      .rangeRound([h - margin.bottom, margin.top]);
          
          //Create axes
          let xAxis = d3.axisTop()
                          .scale(xScale)
                          .tickValues(labelYears)
                          .tickFormat(i => data[i].year);

          let yAxis = d3.axisRight()
                          .scale(yScale)
                          .tickValues(background.values)
                          .tickFormat(spaceFormat);

          //Create chart
          let chart = d3.select("#chart_1")
                          .append("svg")
                          .attr("width", w)
                          .attr("height", h);

          //Add stripes
          let stripes = chart.append("g").attr("class", "stripes")

          for (let element of background.values)   {
                  stripes.append("rect")
                  .attr("x", margin.left)
                  .attr("y", yScale(element + background.height))
                  .attr("width", w - margin.right)
                  .attr("height", yScale(0) - yScale(background.height))
                  .attr("fill", colors[2]);
          } 

          //Add gridlines
          let gridLines = chart.append("g").attr("class", "gridLines")

          for (let element of labelYears) {
              gridLines.append("line")
                  .attr("x1", xScale(element) + margin.left)
                  .attr("y1", yScale(5000))
                  .attr("x2", xScale(element)  + margin.left)
                  .attr("y2", h - margin.bottom)
                  .attr("stroke-width", "0.4pt")
                  .attr("stroke", colors[3])
          }
          //Add bars
          let bars = chart.append("g").attr("class", "bars")

          bars.selectAll("rect")
            .data(data)
            .join("rect")
              .attr("class", d => "i" + d.year)
              .attr("x", (d, i) => xScale(i) + margin.left)
              .attr("y", d => yScale(Math.max(d.increase, 0)))
              .attr("width", xScale.bandwidth())
              .attr("height", d => Math.abs(yScale(d.increase)- yScale(0)))
              .attr("fill", d => (d.increase > 0 ? colors[0] : colors[1]))
              .attr("opacity", "1");

          //Add invisible rectangles
          let bgRects = chart.append("g").attr("class", "bgRects")
          
          bgRects.selectAll("rect")
            .data(data)
            .join("rect")
              .attr("x", (d, i) => xScale(i) + margin.left - 5)
              .attr("y", 0)
              .attr("width", xScale.bandwidth() + 12)
              .attr("height", h)
              .attr("opacity", 0)
              .attr("pointer-events", "all");

          //Add interactivity to bgRects
          bgRects.selectAll("rect").on("mouseover", function(event, d) {

            let currentYear = d.year
            const e = bgRects.selectAll("rect").nodes();
            const i = e.indexOf(this);

            //Turn down opacity for all bars
            bars.selectAll("rect")
              .attr("opacity", 0.4)

            //Highlight current bar
            bars.selectAll("rect.i" + currentYear)
              .attr("opacity", 1)

            //If year 2019, hide the year label
            if(currentYear == 2019) {
              chart.append("rect")
                .attr("class", "temp")
                .attr("x", xScale(23) - 10)
                .attr("y", margin.top - 30)
                .attr("width", 70)
                .attr("height", 25)
                .attr("fill", "white")
            }

            //Create labels
            chart
                .append("text")
                  .attr("class", "tooltip")
                  .classed("numbers", true)
                  .attr("x", xScale(i) )
                  .attr("y", (d.increase > 0) ? (yScale(d.increase) - 28) : (yScale(d.increase) + 20))
                  .attr("pointer-events", "none")
                  .attr("opacity", "0")
                    .style("font-weight", "700")
                    .style("fill", (d.increase > 0) ? colors[0] : colors[1])
                    .text((d.increase > 0 ? "+" + d.increase : d.increase));

            chart
                .append("text")
                  .attr("class", "tooltip")
                  .classed("numbers", true)
                  .attr("x", xScale(i))
                  .attr("y", (d.increase > 0) ? (yScale(d.increase) - 12) : (yScale(d.increase) + 38))
                  .attr("pointer-events", "none")
                  .attr("opacity", "0")
                  .style("fill", (d.increase > 0) ? colors[0] : colors[1])
                  .text(d.year);

            chart.selectAll(".tooltip")
                .attr("opacity", "1")

          }).on("mouseout", function(event, d) {

            //Highlight all bars
            bars.selectAll("rect").attr("opacity", "1")

            //Remove tooltips
            chart.selectAll(".tooltip").remove();
            chart.selectAll(".temp").remove();

          })
              
          //Add axes
          chart.append("g")
              .attr("class", "xAxis")
              .attr("transform", "translate (0, " + margin.top + ")")
              .call(xAxis)
              .selectAll("text")
              .attr("transform", "translate (-10, 0)")
                  .attr("class", "numbers")
                  .attr("text-anchor", "start")
                  .attr("pointer-events", "none")
              
          chart.append("g")
              .attr("class", "yAxis")
              .call(yAxis)
              .selectAll("text")
                  .attr("class", "numbers")
                  .style("fill", colors[3])
                  .attr("transform", "translate (" + (margin.left - 6) + ",-6)")
          }
} 


