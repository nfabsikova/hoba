//Initialise variables for storing data shared by multiple charts
let mc;
let ba;
let grid;
let danube;
let danubeLine;

//Load chart functions
import {makeChart1} from "/charts/chart-1.js"
import {makeChart2} from "/charts/chart-2.js"
import {makeChart3} from "/charts/chart-3.js"
import {makeChart4} from "/charts/chart-4.js"
import {makeChart6} from "/charts/chart-6.js"
import {makeChart9} from "/charts/chart-9.js"
import {makeChart13} from "/charts/chart-13.js";

Promise.all([
  d3.json("data/mc.geojson"),
  d3.json("data/ba.geojson"),
  d3.json("data/grid1km.geojson"),
  d3.json("data/danube.geojson"),
  d3.json("data/danube-line.geojson")
]).then(makeCharts);

function makeCharts([mcData, baData, gridData, danubeData, danubeLineData]) {

  //Assign data
  mc = mcData;
  ba = baData;
  grid = gridData;
  danube = danubeData;
  danubeLine = danubeLineData;

  //Create charts
/*   makeChart1();
  makeChart2();
  makeChart3(mc, ba, danube, danubeLine);
  makeChart4(mc, ba, danube, danubeLine);
  makeChart6();
  makeChart9(mc, ba, danube, danubeLine); */
  makeChart3(mc, ba, danube, danubeLine)
  makeChart13(ba, grid, danube, danubeLine);
}








