var makeChart9 = function() {

    //Width, height and columns for chart
    var chartHeight = 700, chartWidth = 400;
    var colStart = [0, 160, 380];
    var barYStart = 40; barXEnd = 200;

    //Width, height and margins for map
    var mapHeight = 600, mapWidth = 350
    var mapMargin = {right: 30}

    //Colors and pattern
    var colorScale = d3.scaleThreshold()
        .domain([650, 720, 760, 900])
        .range(["#D8D7E5", "#B9B4CF", "#8C86AB", "#5F598C", "#1A135C"]);


    //Load data
    Promise.all([
        d3.csv("data/chart-9.csv", d3.autoType),
        d3.json("data/mc.geojson")
    ]).then(updateChart);

    function updateChart([data, geo]) {
        console.log(geo)

        ////////////////////// MAP //////////////////////
        
        //Define projection and path generator
        var projection = d3.geoMercator().fitSize([mapWidth - mapMargin.right, mapHeight], geo);

        var path = d3.geoPath()
                    .projection(projection);

        //Create map svg
        var map = d3.select("#chart_9_map")
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
                .attr("fill", d => colorScale(d.properties.income))
                .style("stroke", "white")
                .style("stroke-width", "0.5");

        //Add map interactivity
        map.selectAll("path").on("mouseover", function(event, d) {
            
            var currentIndex = d.properties.index;

            chart.selectAll("rect.i" + currentIndex)
                .attr("fill", "#E04E50")
            
        }).on("mouseout", function(event, d) {

            var currentIndex = d.properties.index;
            var currentIncome = d.properties.income;


            chart.selectAll("rect.i" + currentIndex)
                .attr("fill", colorScale(currentIncome))
        })
            


        ////////////////////// CHART //////////////////////

        //Create chart group
        var chart = d3.select("#chart_9_chart")
            .append("g")
            .attr("class", "chart")
            .append("svg")
                .attr("width", chartWidth)
                .attr("height", chartHeight)


        //Create scale functions
        var xScale = d3.scaleLinear()
                        .domain([0, 1250])
                        .range([0, barXEnd])
                        

        var yScale = d3.scaleBand()
                        .domain(d3.range(data.length))
                        .range([0, chartHeight - barYStart])
                        .padding(.5)

        var bars = chart.append("g")
                        .attr("class", "bars")

        console.log(data)

        //create bars
        bars.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("class", d => d.index)
                .attr("x", 0)
                .attr("y", (d, i) => yScale(i) + barYStart)
                .attr("width", d => xScale(d.income))
                .attr("height", yScale.bandwidth())
                .attr("fill", d => colorScale(d.income))

        //add a value label to the right of each bar
        var valueLabels = chart.append("g")
        .attr("class", "valueLabels")

        valueLabels.selectAll("labels")
            .data(data)
            .enter()
            .append("text")
                .attr("x", d => xScale(d.income) + 5)
                .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                .text(d => d.income + " €")
                    .style("font-size", "12px")
                    .style("fill", "#2A2355")

        //add a text label with obec name
        var textLabels = chart.append("g")
            .attr("class", "textLabels")
        
        textLabels.selectAll("labels")
            .data(data)
            .enter()
            .append("text")
                .attr("x",  barXEnd + 50)
                .attr("y", (d, i) => yScale(i) + barYStart + yScale.bandwidth())
                .text((d, i) => d.area)
                    .style("font-size", "12px")
                    .style("fill", "#2A2355")

        //add horizontal lines
        var lines = chart.append("g")
            .attr("class", "lines")

        lines.selectAll("line")
            .data(data)
            .enter()
            .append("line")
                .attr("x1", 0)
                .attr("x2", chartWidth)
                .attr("y1", (d, i) => yScale(i) + barYStart + yScale.bandwidth() + 5)
                .attr("y2", (d, i) => yScale(i) + barYStart + yScale.bandwidth() + 5)
                    .style("stroke", "#E5E5E5")
                    .style("stroke-width", "1.5")

        //Add invisible bg rects
        var bgRects = chart.append("g")
          .attr("class", "bgRects")

        bgRects.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
            .attr("class", d => d.index)
            .attr("x", 0)
            .attr("y", (d, i) => yScale(i) + barYStart)
            .attr("width", chartWidth)
            .attr("height", yScale.bandwidth() * 2)
            .attr("opacity", 0)

        //add header lines
        var headerLines = chart.append("g")
                    .attr("class", "headerLines")

        headerLines.append("line")
            .attr("x1", 0)
            .attr("x2", barXEnd)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", "#808285")
            .attr("stroke-width", 3.5)

        headerLines.append("line")
            .attr("x1", barXEnd + 50)
            .attr("x2", chartWidth)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", "#808285")
            .attr("stroke-width", 3.5)

        //add header labels
        var headerLabels = chart.append("g")
                    .attr("class", "headerLabels")

        headerLabels.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .text("mesačný príjem")
               .style("fill", "#808285")


        headerLabels.append("text")
            .attr("x", barXEnd + 50)
            .attr("y", 20)
            .text("mestská časť")
                .style("fill", "#808285")

        //Add interactivity
        bgRects.selectAll("rect").on("mouseover", function(event, d) {

          let currentIndex = d.index
          
          map.selectAll("path." + currentIndex)
            .attr("fill", "#E04E50")

        }).on("mouseout", function(event, d){

          let currentIndex = d.index;
          let currentIncome = d.income;

          map.selectAll("path." + currentIndex)
            .attr("fill", colorScale(currentIncome));
        })

    }

}
