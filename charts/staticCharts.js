export function makeChart5() {

  let headline = "Skoro tretina SIM kariet prítomných v Bratislave počas dňa prichádza spoza hraníc mesta.";

  // Create all chart sections

  //Create headline
  d3.select("#chart5").append("hr").attr("class", "headline");
  d3.select("#chart5").append("h3").text(headline);

  //Append svg
  makeStaticChart(5, 800);
}

export function makeChart10() {

  let headline = "Rozdiel medzi obyvateľstvom s nižšími a vyššími príjmami sa prehlbuje. V porovnaní medzi rokmi 2004 a 2017 došlo k tomu, že sa zdvojnásobil rozdiel v príjmoch osôb medzi najnižším a najvyšším kvartilom v pracovných príjmoch obyvateľov.";

  //Create headline
  d3.select("#chart10").append("hr").attr("class", "headline");
  d3.select("#chart10").append("h3").text(headline);

  //Append svg
  makeStaticChart(10, 350);
}

export function makeChart11() {

  let headline = "V ostatných desiatich rokoch si Staré Mesto v porovnaní s ostatnými mestskými časťami vedie stále lepšie";

  //Create headline
  d3.select("#chart11").append("hr").attr("class", "headline");
  d3.select("#chart11").append("h3").text(headline);

  //Append svg
  makeStaticChart(11, 800);
}

export function makeStaticChart(chartNumber, chartWidth) {

  //Append svg
  d3.select("#chart" + chartNumber)
    .append("object")
    .attr("type", "image/svg+xml")
    .attr("data", "./charts/chart-" + chartNumber + ".svg")
    .attr("width", chartWidth + "px");
}


