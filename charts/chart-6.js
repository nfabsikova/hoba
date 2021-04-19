export function makeChart6() {

  // *** CHART SETTINGS ***

  //Footnote
  let footnote = "Odkiaľ prichádzajú denní migranti do Bratislavy?, Zdroj údajov: 3 mobilní operátori, Spracovanie údajov: MarketLocator";

  //Width, height and margins
  let margin = {left: 4}
  let mapHeight = 680, mapWidth = 480
  let chartHeight = 680, chartWidth = 320
  let barXStart = 155, barYStart = 250, barWidth = 110, barHeight = 380

  //Colors and pattern
  let colorScale = d3.scaleThreshold()
      .domain([1, 250, 500, 1500, 2250, 3500])
      .range(["#FFFFFF", "#e2dfeb", "#b9b3cc", "#958bb1", "#7e739e", "#53487c", "#241a57"]);
  let colors = ["#241b58", "#eb897f", "#d4d4d4", "#f4f4f4", "#808285"]

  //Define legend keys and position
  let keys = ["0–250", "250–500", "500–1500", "1500–2250", "2250–3500", "3500–11602"];
  let lgColors = ["#e2dfeb", "#b9b3cc", "#958bb1", "#7e739e", "#53487c", "#241a57"];
  let lgTop = mapHeight * 0.02;
  let lgLeft = mapWidth * 0.68;
  let lgHeight = 21;

  //Number formatting
  let commaFormat = d3.format(",");
  let spaceFormat = function(num) {
      return commaFormat(num).replace(/,/, " ");
  }

  // *** END OF SETTINGS ***

  //Create all chart section elements
  d3.select("#chart6").append("div").attr("id", "chart6_container");

  //Create chart
  d3.select("#chart6_container").append("div").attr("id", "chart6_chart").style("float", "left")
  let chart = d3.select("#chart6_chart")
    .append("svg")
    .attr("class", "chart")
    .attr("width", chartWidth)
    .attr("height", chartHeight)

  //Create map
  d3.select("#chart6_container").append("div").attr("id", "chart6_map").style("float", "left")
  let map = d3.select("#chart6_map")
    .append("svg")
    .attr("class", "map")
    .attr("width", mapWidth)
    .attr("height", mapHeight)

  //Create tooltip
  let tooltip = d3.select("#chart6_map").append("div").attr("id", "tooltip6").attr("class", "hidden").append("p");
  tooltip.append("span").attr("id", "city6").style("font-weight", "600").text("Obec")
  tooltip.append("span").attr("id", "value6").attr("class", "numbers").text("100");

  //Create footnote
  d3.select("#chart6").append("p").text("a").style("color", "white").style("font-size", "2px");
  d3.select("#chart6").append("hr")
  d3.select("#chart6").append("p").attr("class", "footnote").text(footnote)

  //Load data
  Promise.all([
      d3.csv("data/chart-6.csv", d3.autoType),
      d3.json("data/chart-6.geojson"),
      d3.json("data/chart-6-line.geojson")
  ]).then(updateChart);

  function updateChart([data, geo, line]) {

      ////////////////////// MAP //////////////////////
      
      //Define projection and path generator
      let projection = d3.geoMercator()
        .center([18, 48.55])
        .scale(20500)

      let path = d3.geoPath()
                  .projection(projection);

      let polygons = map.append("g")
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
                      return colors[2]
                  } else {
                      return colorScale(d.properties.flow)
                  }   
              })
              .style("stroke", "none");

      //Add map outline
      map.selectAll("path.line")
          .data(line.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", colors[0])
          .attr("pointer-events", "none")
          .style("stroke-width", "0.8");

      //Add legend
      let legend = map.append("g")
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
              .attr("y", (d,i) => lgTop + i*lgHeight ) 
              .attr("width", 15)
              .attr("height", 15)
              .attr("rx", 1.5)
              .attr("ry", 1.5)
              .style("fill", (d,i) => lgColors[i])
              .style("stroke", "white")
              .style("stroke-width", "1.2")
              .attr("pointer-events", "none");

      legendText.selectAll("legendText")
      .data(keys)
      .enter()
      .append("text")
          .attr("class", "numbers")
          .attr("x", lgLeft + 25)
          .attr("y", (d,i) => lgTop + i*lgHeight + 13) 
          .text(d => d)
          .style("font-size", "12px")
          .attr("pointer-events", "none")
          .style("fill", colors[4])


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

              d3.select(this).attr("fill", colors[1])

              d3.select("#tooltip6").classed("hidden", false);
          }


          //Add highlight to chart
          let currentIndex = this.getAttribute("class")

          bars.selectAll("rect." + currentIndex)
              .attr("fill", colors[1])
          

          
      }).on("mouseout", function(event, d) {

          let currentIndex = this.getAttribute("class")
          let currentFlow = d.properties.flow


          d3.select(this).attr("fill", d => d.properties.IDN3 == 103? "#DADADA" : colorScale(currentFlow))

          d3.select("#tooltip6").classed("hidden", true);

          //Remove highlight from chart
          bars.selectAll("rect." + currentIndex)
              .attr("fill", colorScale(currentFlow))

      })

      ////////////////////// CHART //////////////////////

          //Create scale functions
          let xScale = d3.scaleLinear()
                          .domain([0, 12000])
                          .range([0, barWidth])
                          

          let yScale = d3.scaleBand()
                          .domain(d3.range(data.length))
                          .range([0, barHeight])
                          .padding(.5)

          //add stripes
          let rects = chart.append("g")
              .attr("class", "rects")

          rects.selectAll("rect")
              .data(data)
              .enter()
              .append("rect")
                  .attr("x", margin.left)
                  .attr("y", (d, i) => yScale(i) + barYStart - 8)
                  .attr("width", chartWidth)
                  .attr("height", 26)
                  .attr("fill", (d, i) => i % 2 == 0 ? "white" : colors[3])
                  .attr("opacity", 1)

          let bars = chart.append("g")
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
                  .attr("stroke", colors[0])
                  .attr("stroke-width", 0.8)
                  .attr("pointer-events", "none");

          //add a text label to the left of each bar
          let textLabels = chart.append("g")
              .attr("class", "textLabels")
          
          textLabels.selectAll("labels")
              .data(data)
              .enter()
              .append("text")
                  .attr("x", margin.left )
                  .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                  .attr("pointer-events", "none")
                  .text((d, i) => ((i+1) < 10 ? "\u00A0\u00A0" : "") + (i+1) + "\u00A0\u00A0\u00A0"+ d.obec)
                    .style("font-family", "ff-real-headline-pro, sans-serif")
                      .style("fill", colors[0])
                      .style("font-size", "12px")

          //add a value label to the right of each bar
          let valueLabels = chart.append("g")
              .attr("class", "valueLabels")

          valueLabels.selectAll("labels")
              .data(data)
              .enter()
              .append("text")
                  .attr("class", "numbers")
                  .attr("pointer-events", "none")
                  .attr("x", d => barXStart + xScale(d.flow) + 4)
                  .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                  .text(d => spaceFormat(d.flow))
                      .style("fill", colors[0])
                      .style("font-size", "12px")

          //add bottom label
          chart.append("foreignObject")
              .attr("x", barXStart - 30)
              .attr("y", barYStart + barHeight - 10)
              .attr("width", 170)
              .attr("height", 50)
              .attr("pointer-events", "none")
              .append("xhtml:body")
                  .html("<p style='font-size:14px'>80 604 z iných miest</p>")
                  .style("color", colors[4])



          //add interactivity
          rects.selectAll("rect").on("mouseover", function(event, d) {
              
              let currentIndex = d.IDN4

              map.selectAll("path.i" + currentIndex)
                  .attr("fill", colors[1])

          }).on("mouseout", function(event, d) {

              let currentIndex = d.IDN4
              let currentFlow = d.flow

              map.selectAll("path.i" + currentIndex)
                  .attr("fill", colorScale(currentFlow))
          })

      ////////////////////// HEADER //////////////////////
      let header = chart.append("g")
                      .attr("class", "header")

      header.append("foreignObject")
          .attr("x", 0)
          .attr("y", -10)
          .attr("width", 350)
          .attr("height", 170)
          .attr("pointer-events", "none")
          .append("xhtml:h3")
              .style("text-anchor", "start")
              .html("<h3>138 557 SIM kariet denne<br>prichádza do Bratislavy<br>z Bratislavského a Trnavského<br>kraja, 57 953 z nich pochádza<br>zo 14 lokalít.</h3>")
              .style("font-size", "16px")

      header.append("line")
          .attr("x1", 0)
          .attr("x2", chartWidth)
          .attr("y1", 5)
          .attr("y2", 5)
              .style("stroke", colors[0])
              .style("stroke-width", 1.6)
                
  }

}