var allData = [];
var filteredData = [];

// Keep track of which things are turned on
var currScore = 52;
var intersected = false;
var miletopixel = 71.89980860331622;

var drag = d3.drag()
    .on("drag", dragmove)

function loadData(data) {
    initialData(data);
    visualize(data);
}

function initialData(data) {
    allData = data.slice(); // global declaration
    filteredData = [];

    // circle A
    svg.append("circle")
	.attr("cx", 280)
	.attr("cy", 400)
	.attr("r", miletopixel)
	.attr("fill", "#FF0000")
	.attr("fill-opacity", 0.15)
	.attr("id", "A")
	.call(drag);

    // circle B
    svg.append("circle")
	.attr("cx", 350)
	.attr("cy", 400)
	.attr("r", miletopixel)
	.attr("fill", "#0000FF")
	.attr("fill-opacity", 0.15)
	.attr("id", "B")
	.call(drag);
};

function update(lowestScore){
    filteredData = [];
    for(var i = 0; i < allData.length; i++) {
	var restaurant_score = allData[i].inspection_score;
	if(Number(restaurant_score) >= Number(lowestScore)) {
	    filteredData.push(allData[i]);
	}
    }
}

function filterData() {
    filteredData = [];
    update(currScore);
    if (intersected) {
	for (var x = filteredData.length - 1; x >= 0; x--) {
	    var currentDataPoint = filteredData[x];
	    if (!insideIntersection(currentDataPoint)) {
		filteredData.splice(x, 1);}}}}

function intersect(point) {
    var checked = point.checked;
    if (checked) {
	intersected = true;
	visualize(filteredData);
    } else {
	intersected = false;
	visualize(allData);}}

// visualize
function visualize(data) {
    filterData();
    // console.log(filteredData.length);
    var circles = svg.selectAll("circle.dataPoints")
  	.data(filteredData, function(d) {return d.business_id})
    // console.log(circles);

    circles.enter()
  	.append("circle")
	.attr("class", "dataPoints")
  	.style("fill","blue")
	.attr("data_id", function(d) {d.business_id})
  	.attr("cx", function(d){ return projection([d.business_longitude, d.business_latitude])[0];})
  	.attr("cy", function(d){ return projection([d.business_longitude, d.business_latitude])[1];})
  	.attr("r", 1);
    // console.log(circles);
    circles.exit().remove();
}

// Create the drag() -- define the dragmove function
function dragmove(d){
    var x = d3.event.x;
    var y = d3.event.y;
    d3.select(this)
	.attr("cx", x)
	.attr("cy", y);
    visualize(filteredData);
}

// Change the radius of 2 points, A and B
function changeRadiusA(radius) {
    document.querySelector('#valueA').value = radius + " mi";
    var pixelRadius = radius * miletopixel;
    d3.select("#A")
	.attr("r", pixelRadius);
    visualize(filteredData);
}

function changeRadiusB(radius) {
    document.querySelector('#valueB').value = radius + " mi";
    var pixelRadius = radius * miletopixel;
    d3.select("#B")
	.attr("r", pixelRadius);
    visualize(filteredData);
}

function changeScore(review_score) {
    document.querySelector('#valueS').value = review_score + " Score";
    currScore = review_score;
    // d3.select("#scoreAcc")
    //     .on("input", function() {
    //         update(+this.value);
    //     });
    visualize(filteredData);
}

function insideIntersection(d) {
    var circleA = d3.select("#A");
    var circleB = d3.select("#B");

    var A_X = projection([d.business_longitude, d.business_latitude])[0] - circleA.attr("cx");
    var A_Y = projection([d.business_longitude, d.business_latitude])[1] - circleA.attr("cy");
    var B_X = projection([d.business_longitude, d.business_latitude])[0] - circleB.attr("cx");
    var B_Y = projection([d.business_longitude, d.business_latitude])[1] - circleB.attr("cy");
    var A_R = circleA.attr("r");
    var B_R = circleB.attr("r");

    var Z = (Math.pow(A_X, 2) + Math.pow(A_Y, 2) <= Math.pow(A_R, 2)
    	     && Math.pow(B_X, 2) + Math.pow(B_Y, 2) <= Math.pow(B_R, 2));
    return Z;
}
