//variable definition
var CHART_WIDTH = 300;
var CHART_HEIGHT = 160;
var MARGIN = {
    left: 0.1 * CHART_WIDTH,
    top: 0.1 * CHART_HEIGHT,
    bottom: 0.1 * CHART_HEIGHT,
    right: 0.05 * CHART_WIDTH
};
var CHART_BODY_WIDTH = CHART_WIDTH - MARGIN.right - MARGIN.left;
var CHART_BODY_HEIGHT = CHART_HEIGHT - MARGIN.bottom - MARGIN.top;
var AVERAGE = 3.87; //average across all restaurants
var CATEGORIES = ["American (Traditional)", "Chinese", "Japanese", "Indian", "Italian", "French", "Greek", "Vietnamese", "Mediterranean", "Mexican", "Thai"];


function drawChart(yelpData, chartNum) {
    let data = Object.keys(yelpData)
        .filter(k => !isNaN(+k) && yelpData[k] != "")
        .map(k => ({
            "year":+k,
            "rating":+yelpData[k]
        }));
    
    yearRange = d3.extent(data, d => d.year);
    
    xScale = d3.scaleLinear()
        .range([0, CHART_BODY_WIDTH])
        .domain([2005,2017]);
    
    yScale = d3.scaleLinear()
        .range([0, CHART_BODY_HEIGHT])
        .domain([5, 0]);
    
    const points = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.rating));
    
    let chart = d3.select("#category"+chartNum)
        .append("g")
        .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);
    
    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("d", points)
        .append("title")
            .text(yelpData.name);
    
    
}

function drawData(data, category, chartNum) {
    dataSet = getDataForCategory(data, category);
    for(i=0; i<dataSet.length; i++){
        drawChart(dataSet[i], chartNum);
    }
    
}

function loadData(cb) {
    d3.csv("averaged_data.csv", (err, data) => {
        cb(data);
    });
}

function getDataForCategory(data, category) {
    catData = data.filter(d => d["category"] === category);
    return catData;
}

function main() {
    loadData((data) => {
        for(j=0; j<CATEGORIES.length; j++){
            d3.select("#h3"+""+j).text(CATEGORIES[j]);
            drawData(data, CATEGORIES[j], ""+j);
        }
    })
}

main();