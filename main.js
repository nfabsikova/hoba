//Load chart functions
import {makeChart1} from "./charts/chart-1.js"
import {makeChart2} from "./charts/chart-2.js"
import {makeChart3} from "./charts/chart-3.js"
import {makeChart4} from "./charts/chart-4.js"
import {makeChart5, makeChart10, makeChart11, makeStaticChart} from "./charts/staticCharts.js"
import {makeChart6} from "./charts/chart-6.js"
import {makeChart9} from "./charts/chart-9.js"
import {makeChart13} from "./charts/chart-13.js";
import {makeChart14} from "./charts/chart-14.js";

Promise.all([
  d3.json("./data/mc.geojson"),
  d3.json("./data/ba.geojson"),
  d3.json("./data/grid.geojson"),
  d3.json("./data/grid-bg.geojson"),
  d3.json("./data/danube.geojson"),
  d3.json("./data/danube-line.geojson")
]).then(makeCharts);

function makeCharts([mcData, baData, gridData, gridBgData, danubeData, danubeLineData]) {

  //Assign data
  let mc = mcData;
  let ba = baData;
  let grid = gridData;
  let gridBg = gridBgData;
  let danube = danubeData;
  let danubeLine = danubeLineData;

  // Create charts
  // makeChart1();
  // makeChart2();
  // makeChart3(mc, ba, danube, danubeLine);
  // makeChart4(mc, ba, danube, danubeLine);
  // makeChart5();
  // makeChart6();
  // makeStaticChart(7, 800);
  // makeStaticChart(8, 600);
  // makeChart9(mc, ba, danube, danubeLine);
  // makeChart10();
  // makeChart11();
  // makeStaticChart(12, 500);
  // makeChart13(mc, ba, grid, gridBg, danube, danubeLine);
  makeChart14(mc, ba, grid, gridBg, danube, danubeLine);
}







