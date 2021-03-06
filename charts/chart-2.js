
export function makeChart2() {

  // *** CHART SETTINGS ***
  
  //Headline and footnote
  let headline = "Rozdiel v populačnej dynamike medzi metropolitným regiónom Bratislavy a zvyškom krajiny sa v najbližších rokoch pravdepodobne prehĺbi, pretože hlavné mesto demograficky odčerpáva ostatné územie, hlavne regióny."
  let footnote = "Projekcia populácie (v %) pre bratislavský metropolitný región a Slovenskú republiku, Zdroj: Eurostat";

  //Width, height and margins
  let w = 700;
  let h = 600;
  let margin = {top: 60, right: 100, bottom: 40, left: 60}

  //Colors
  let colors = ["#241b58", "#7e739e", "#f4f4f4", "#d4d4d4"];

  // *** END OF SETTINGS ***

  //Background rectangles                
  let bgRects = {
      values: [-0.03, -0.01, 0.01, 0.03, 0.05, 0.07], //value defines the top of the rect
      height: 0.01
  }

  //Axes formatting
  let labelYears = [2016, 2020, 2030, 2040, 2050]
  let formatPercent = d3.format("+,.0%");
  let formatPercent2  = function(num) {
      return d3.format("+,.2%")(num).replace(".", ",");
  }

  //Create all chart section elements

  //Create headline
  d3.select("#chart2").append("hr").attr("class", "headline")

  d3.select("#chart2").append("h3").text(headline)

  //Create svg
  let chart = d3.select("#chart2")
    .append("div").attr("id", "chart2_container")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

  //Create footnote
  d3.select("#chart2").append("hr").style("max-width", "700px").style("margin-left", "0px");
  
  d3.select("#chart2").append("p").attr("class", "footnote").text(footnote);

  //Load data
  d3.csv("data/chart-2.csv", d3.autoType)
      .then(dataIsReady);

  function dataIsReady(data) {
          updateChart(data);
      }
  
  function updateChart(data) {

      //Create scale functions 
      let x = d3.scaleLinear()
                      .domain([d3.min(data, d => d.year),
                              d3.max(data, d => d.year)])
                      .rangeRound([margin.left, w - margin.right]);

      let y = d3.scaleLinear()
                  .domain([d3.min(data, d => d.sk),
                          d3.max(data, d => d.ba)])
                  .rangeRound([h - margin.bottom, margin.top]);
      
      //Create axes
      let xAxis = d3.axisTop()
                      .scale(x)
                      .tickValues(labelYears)
                      .tickFormat(d3.format(".4"));

      let yAxis = d3.axisRight()
                      .scale(y)
                      .ticks(5)
                      .tickFormat(formatPercent);

      //Define area generator (background stripes)
      let area = d3.area()
                  .x(d => x(d.year))
                  .y0(d => y(d.sk))
                  .y1(d => y(d.ba));
      
      
      //Define line generators                
      let lineBa = d3.line()
                      .x(d => x(d.year))
                      .y(d => y(d.ba));

      let lineSk = d3.line()
                  .x(d => x(d.year))
                  .y(d => y(d.sk));
                  
      //Add stripes
      let stripes = chart.append("g").attr("class", "stripes")

      for (let element of bgRects.values)   {
              stripes.append("rect")
              .attr("x", 0)
              .attr("y", y(element))
              .attr("width", x(d3.max(data, d => d.year)))
              .attr("height", y(0) - y(bgRects.height))
              .attr("fill", colors[2])
              .attr("pointer-events", "none");
      } 

      //Add gridlines
      let gridLines = chart.append("g").attr("class", "gridLines")

      gridLines.selectAll("line")
          .data(data)
          .join("line")
          .attr("x1", d => x(d.year))
          .attr("x2", d => x(d.year))
          .attr("y1", y(0.07))
          .attr("y2", d => y(d.sk))
          .attr("stroke-width", "1")
          .attr("stroke", colors[3])
          .attr("pointer-events", "none")

      //Add area
      let paths = chart.append("g").attr("class", "paths")

      paths
          .append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .attr("opacity", "0.3")
          .attr("pointer-events", "none")
          .attr("fill", colors[1]);

      //Add line for Slovakia
      paths
          .append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", lineSk)
          .attr("pointer-events", "none")
            .style("stroke", colors[1]);

      //Add line for Bratislava 
      paths
          .append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", lineBa)
          .attr("opacity", "1")
          .attr("pointer-events", "none")
            .style("stroke", colors[0]);


      //Add circles
      let points = chart.append("g").attr("class", "points")

      points.selectAll("circleBa")
          .data(data)
          .join("circle")
          .attr("cx", d => x(d.year))
          .attr("cy", d => y(d.ba))
          .attr("r", 5)
          .attr("opacity", "1")
          .attr("fill", colors[0])
          .attr("stroke", "white")
          .attr("stroke-width", 2);

      points.selectAll("circleSk")
          .data(data)
          .join("circle")
          .attr("cx", d => x(d.year))
          .attr("cy", d => y(d.sk))
          .attr("r", function (d) {return d.year == 2016 ? 0 : 5})
          .attr("opacity", "1")
          .attr("fill", colors[1])
          .attr("stroke", "white")
          .attr("stroke-width", 2); 


      //Add invisible rectangles
      let rects = chart.append("g").attr("class", "bgRects")

      rects.selectAll("rect")
          .data(data.slice(1))
          .join("rect")
          .attr("x", d => x(d.year - 5))
          .attr("y", 0)
          .attr("width", d => x(d.year + 5) -  x(d.year - 5))
          .attr("height", h)
          .attr("fill", "none")
          .attr("pointer-events", "all");
      
      //Add Labels
      chart.append("text")
          .attr("x", x(2050) + 15)
          .attr("y", y(d3.max(data, d => d.ba)) + 5)
          .text("Bratislava")
          .attr("pointer-events", "none")
          .style("fill", colors[0]);

      chart.append("text")
          .attr("x", x(2050) + 15)
          .attr("y", y(d3.min(data, d => d.sk)) + 5)
          .text("Slovensko")
          .attr("pointer-events", "none")
          .style("fill", colors[1]);

        //Add interactivity to groups
      rects.selectAll("rect").on("mouseover", function(event, d) {

              //Turn down line and area opacity
              chart.selectAll("path.area")
                .attr("opacity", 0.1)

              chart.selectAll("path.line")
                  .attr("opacity", "0.4")

              //Hide all circles
              points.selectAll("circle")
                  .attr("opacity", "0")

              //Create highlighted line and area segments
              let currentYear = d.year;
              let currentBa = d.ba;
              let currentSk = d.sk;
              

              chart
                  .append("path")
                  .datum(data.filter(d => d.year <= currentYear))
                  .attr("class", "area temp")
                  .attr("d", area)
                  .attr("pointer-events", "none")
                  .attr("fill", colors[1])
                  .attr("opacity", 0.2)

              chart
                  .append("path")
                  .datum(data.filter(d => d.year <= currentYear))
                  .attr("class", "line temp")
                  .attr("d", lineBa)
                  .attr("pointer-events", "none")
                  .style("stroke", colors[0]);


              chart 
                  .append("path")
                  .datum(data.filter(d => d.year <= currentYear))
                  .attr("class", "line temp")
                  .attr("d", lineSk)
                  .attr("pointer-events", "none")
                  .style("stroke", colors[1]);


              //Create temporary circles
              chart
                  .append("circle")
                  .attr("class", "temp")
                  .attr("cx", x(currentYear))
                  .attr("cy", y(currentBa))
                  .attr("r", 6)
                  .attr("fill", colors[0])
                  .attr("stroke", "white")
                  .attr("stroke-width", 2);

              chart
                  .append("circle")
                  .attr("class", "temp")
                  .attr("cx", x(2016))
                  .attr("cy", y(0))
                  .attr("r", 5)
                  .attr("fill", colors[0])
                  .attr("stroke", "white")
                  .attr("stroke-width", 2);
                  

              chart
                  .append("circle")
                  .attr("class", "temp")
                  .attr("cx", x(currentYear))
                  .attr("cy", y(currentSk))
                  .attr("r", 6)
                  .attr("fill", colors[1])
                  .attr("stroke", "white")
                  .attr("stroke-width", 2);

              //Create the tooltip labels and make them appear with transition
              chart
                  .append("text")
                  .attr("class", "tooltip numbers")
                  .attr("x", x(d.year) - 5)
                  .attr("y", y(d.ba) - 15)
                  .attr("text-anchor", "middle")
                  .attr("pointer-events", "none")
                  .attr("opacity", "1")
                  .style("fill", colors[0])
                  .style("font-weight", "700")
                  .text(formatPercent2(d.ba));

              chart
                  .append("text")
                  .attr("class", "tooltip numbers")
                  .attr("x", x(d.year) - 4)
                  .attr("y", y(d.sk) + 30)
                  .attr("text-anchor", "middle")
                  .attr("pointer-events", "none")
                  .attr("opacity", "1")
                  .style("fill", colors[1])
                  .style("font-weight", "700")
                  .text(formatPercent2(d.sk));

          })
          .on("mouseout", function (event, d){

              //Remove temporary circles

              //Make all circles appear again
              chart.selectAll("circle")
                  .attr("opacity", "1");

              //Remove temporary lines
              chart.selectAll(".temp").remove()

              //Remove tooltips
              chart.selectAll(".tooltip").remove();

              //Turn opacity back on
              chart.selectAll("path.area")
                .attr("opacity", 0.3)
              chart.selectAll("path.line")
                  .attr("opacity", "1");

          });          


      //Add axes
      chart.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate (0, " + 30 + ")")
          .call(xAxis)
          .selectAll("text")
            .classed("numbers", true)
            .attr("pointer-events", "none")
            .attr("text-anchor", "start")
          
      chart.append("g")
          .attr("class", "yAxis")
          .call(yAxis)
          .selectAll("text")
              .classed("numbers", true)
              .style("fill", colors[3])
              .attr("transform", "translate (-9, -5)");
      }
  
}
 
            