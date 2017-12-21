//variable definition
var CHART_WIDTH = 300;
var CHART_HEIGHT = 160;
var MARGIN = {
    left: 0.1 * CHART_WIDTH,
    top: 0.1 * CHART_HEIGHT,
    bottom: 0.12 * CHART_HEIGHT,
    right: 0.05 * CHART_WIDTH
};
var CHART_BODY_WIDTH = CHART_WIDTH - MARGIN.right - MARGIN.left;
var CHART_BODY_HEIGHT = CHART_HEIGHT - MARGIN.bottom - MARGIN.top;
var AVERAGE = 3.87; //average across all restaurants
var CATEGORIES = ["American (Traditional)", "Chinese", "Japanese", "Indian", "Italian", "French", "Greek", "Vietnamese", "Mediterranean", "Mexican", "Thai"];


function drawLine(yelpData, chartNum) {
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
        .attr("stroke", "black")
        .style("stroke-opacity", 0.15)
        .attr("width", 1)
        .attr("d", points)
        .append("title")
            .text(yelpData.name);
    
    d3.selectAll("path")
        .on("mouseover", function() {
        d3.select(this)
            .style("stroke-opacity", 1)
            .style("width", 4);
    })
        .on("mouseout", function() {
        d3.select(this)
            .style("stroke-opacity", 0.15)
            .style("width", 1);
    });
}

function drawData(data, category, chartNum) {
    dataSet = getDataForCategory(data, category);
    for(i=0; i<dataSet.length; i++){
        drawLine(dataSet[i], chartNum);
    }
}

function finishChart(chartNum) {
    xScale = d3.scaleLinear()
        .range([0, CHART_BODY_WIDTH])
        .domain([2005,2017]);
    
    yScale = d3.scaleLinear()
        .range([0, CHART_BODY_HEIGHT])
        .domain([5, 0]);
    
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d => ""+d)
        .ticks(6);
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d => "'"+(""+d).substring(2,4));
    
    d3.select("#category"+chartNum)
        .append("g")
            .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
            .call(yAxis)
            .append("text")
                .text("Average Rating by Year")
                .attr("dx", -MARGIN.left)
                .attr("dy", MARGIN.top+8)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("transform", `rotate(270, ${-MARGIN.left+20}, ${MARGIN.top+18})`);
    
    d3.select("#category"+chartNum)
        .append("g")
        .attr("transform", `translate(${MARGIN.left}, ${CHART_HEIGHT-MARGIN.bottom})`)
        .call(xAxis)
    
    d3.select("#category"+chartNum)
        .append("line")
        .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
        .style("stroke","#49b6bc")
        .attr("x1", xScale(2005))
        .attr("y1", yScale(AVERAGE))
        .attr("x2", xScale(2017))
        .attr("y2", yScale(AVERAGE))
        .append("title")
            .text("Collective Average");
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
            finishChart(""+j);
            drawData(data, CATEGORIES[j], ""+j);
            d3.select("#h3"+""+j).text(CATEGORIES[j]+" ("+i+" Restaurants)");
        }
    })
}

main();