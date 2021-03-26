let makeChart9 = function() {

    //Width, height and columns for chart
    let chartHeight = 700, chartWidth = 400;
    let colStart = [0, 160, 380];
    let barYStart = 40; barXEnd = 200;

    //Width, height and margins for map
    let mapHeight = 600, mapWidth = 350
    let mapMargin = {right: 30}

    //Colors and pattern
    let colors = ["#241b58", "#eb897f", "#878787","#d4d4d4","#f4f4f4"]
    let colorScale = d3.scaleThreshold()
        .domain([650, 720, 760, 900])
        .range(["#D8D7E5", "#B9B4CF", "#8C86AB", "#5F598C", "#1A135C"]);


    //Load data
    Promise.all([
        d3.csv("data/chart-9.csv", d3.autoType),
        d3.json("data/mc.geojson"),
        d3.json("data/ba.geojson"),
        d3.json("data/danube.geojson"),
        d3.json("data/danube-line.geojson")
    ]).then(updateChart);

    function updateChart([data, mc, ba, danube, danubeLine]) {

        ////////////////////// MAP //////////////////////
        
        //Define projection and path generator
        let projection = d3.geoMercator().fitSize([mapWidth, mapHeight], mc);

        let path = d3.geoPath()
                    .projection(projection);

        //Create map svg
        let map = d3.select("#chart_9_map")
            .append("svg")
            .attr("class", "map")
            .attr("width", mapWidth)
            .attr("height", mapHeight)

        //Add mestske casti polygons
        map.selectAll("path")
            .data(mc.features)
            .enter()
            .append("path")
                .attr("d", path)
                .attr("class", d => "i" + d.properties.index)
                .attr("fill", d => colorScale(d.properties.income))
                .style("stroke", "white")
                .style("stroke-width", "0.6");

        //Add bratislava outline
        map.selectAll("path.ba")
        .data(ba.features)
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

        //Add map interactivity
        map.selectAll("path").on("mouseover", function(event, d) {
            
            let currentIndex = d.properties.index;

            bars.selectAll("rect.i" + currentIndex)
                .attr("fill", colors[1])
            
        }).on("mouseout", function(event, d) {

            let currentIndex = d.properties.index;
            let currentIncome = d.properties.income;


            bars.selectAll("rect.i" + currentIndex)
                .attr("fill", colorScale(currentIncome))
        })
            


        ////////////////////// CHART //////////////////////

        //Create chart group
        let chart = d3.select("#chart_9_chart")
            .append("g")
            .attr("class", "chart")
            .append("svg")
                .attr("width", chartWidth)
                .attr("height", chartHeight)


        //Create scale functions
        let xScale = d3.scaleLinear()
                        .domain([0, 1250])
                        .range([0, barXEnd])
                        

        let yScale = d3.scaleBand()
                        .domain(d3.range(data.length))
                        .range([0, chartHeight - barYStart])
                        .padding(.5)


        //Add bg rects
        let bgRects = chart.append("g")
          .attr("class", "bgRects")

        bgRects.selectAll("rect.bg")
          .data(data)
          .enter()
          .append("rect")
            .attr("class", d => d.index)
            .attr("x", 0)
            .attr("y", (d, i) => yScale(i) + barYStart - 12)
            .attr("width", chartWidth)
            .attr("height", yScale.bandwidth() * 2)
            .attr("fill", (d, i) => i % 2 === 0 ? "white" : colors[4])
            .attr("opacity", 1)

        //create bars
        let bars = chart.append("g")
        .attr("class", "bars")
        bars.selectAll("rect.bar")
            .data(data)
            .enter()
            .append("rect")
                .attr("class", d => d.index)
                .attr("x", 0)
                .attr("y", (d, i) => yScale(i) + barYStart)
                .attr("width", d => xScale(d.income))
                .attr("height", yScale.bandwidth())
                .attr("fill", d => d.area === 'Bratislava' ? colors[3] : colorScale(d.income))
                .style("stroke", d => d.area === 'Bratislava' ? colors[2] : colors[0])
                .style("stroke-width", "0.8")
                .attr("pointer-events", "none");

        //add a value label to the right of each bar
        let valueLabels = chart.append("g")
          .attr("class", "valueLabels")

        valueLabels.selectAll("labels")
            .data(data)
            .enter()
            .append("text")
                .attr("x", d => xScale(d.income) + 5)
                .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                .attr("class", "numbers")
                .attr("pointer-events", "none")
                .text(d => d.income + " €")
                    .style("font-size", "12px")
                    .style("fill", d => d.area === 'Bratislava' ? colors[2] : colors[0])

        //add a text label with obec name
        let textLabels = chart.append("g")
            .attr("class", "textLabels")
        
        textLabels.selectAll("labels")
            .data(data)
            .enter()
            .append("text")
                .attr("x",  barXEnd + 50)
                .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                .attr("pointer-events", "none")
                .text((d, i) => d.area)
                    .style("font-size", "12px")
                    .style("fill", d => d.area === 'Bratislava' ? colors[2] : colors[0])

        //add header lines
        let headerLines = chart.append("g")
                    .attr("class", "headerLines")

        headerLines.append("line")
            .attr("x1", 0)
            .attr("x2", barXEnd)
            .attr("y1", 5)
            .attr("y2", 5)
            .attr("stroke", colors[2])
            .attr("stroke-width", 1.5)

        headerLines.append("line")
            .attr("x1", barXEnd + 50)
            .attr("x2", chartWidth)
            .attr("y1", 5)
            .attr("y2", 5)
            .attr("stroke", colors[2])
            .attr("stroke-width", 1.5)

        //add header labels
        let headerLabels = chart.append("g")
                    .attr("class", "headerLabels")

        headerLabels.append("text")
            .attr("x", 0)
            .attr("y", 25)
            .text("mesačný príjem")
              .style("font-size", "12px")
              .style("fill", colors[2])


        headerLabels.append("text")
            .attr("x", barXEnd + 50)
            .attr("y", 25)
            .text("mestská časť")
              .style("font-size", "12px")
              .style("fill", colors[2])

        //Add interactivity
        bgRects.selectAll("rect").on("mouseover", function(event, d) {

          let currentIndex = d.index
          
          map.selectAll("path." + currentIndex)
            .attr("fill", colors[1]);

        }).on("mouseout", function(event, d){

          let currentIndex = d.index;
          let currentIncome = d.income;

          map.selectAll("path." + currentIndex)
            .attr("fill", colorScale(currentIncome));
        })

    }

}
