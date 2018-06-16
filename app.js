var svgWidth = 950;
var svgHeight = 750;

var margin = {
	top:60,
	right:40,
	bottom: 100,
	left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select('.chart')
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

var chart = svg.append("g");

d3.select(".chart")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 1);

d3.csv("data.csv", function(error, healthData){
	if (error) throw error;

	healthData.forEach(function(data){
		data.poverty = +data.poverty;
		data.healthStatus = +data.healthStatus;
	});

	var xLinearScale = d3.scaleLinear().range([0, chartWidth]);
	var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);

	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	xLinearScale.domain([0,d3.max(healthData, function(data){
		return +data.poverty;
	})]);

	yLinearScale.domain([0,d3.max(healthData, function(data){
		return +data.healthStatus;
	})]);

	var toolTip = d3.tip()
		.att("class", "toolTip")
		.offset([80,-60])
		.html(function(data){
			var state = data.state;
			var povertyRate = +data.poverty;
			var healthStatus = +data.healthStatus;
			return(state + "<br> Poverty Rate: " + povertyRate + "<br> Percentage of the population in fair or poor health: " + healthStatus)
		});

	chart.call(toolTip);

	chart.selectAll("circle")
		.data(healthData)
		.enter().append("circle")
			.attr("cx", function(data, index){
				console.log(data.poverty);
				return xLinearScale(data.poverty);
			})
			.attr("cy", function(data, index){
				console.log(data.healthStatus);
				return yLinearScale(data.healthStatus);
			})
			.attr('r', "10")
			.attr("fill", "blue")
			.style("opacity", .5)
			.on("click", function(data){
				toolTip.show(data);
			});
		chart.append("g")
			.attr("transform", `translate(0, %{chartHeight})`)
			.call(bottomAxis);

	chart.append('g')
		.call(leftAxis);

	chart.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left + 40)
		.attr("x", 0 - (chartHeight))
		.attr("dy", "1em")
		.attr("class", "axisText")
		.text("Percentage of the Population in Fair or Poor Health")

	chart.append("text")
		.attr("transform", "translate(" + (chartWidth/3) + ", " + (chartHeight + margin.top +30) + ")")
		.attr("class", "axisText")
		.text("Percentage of the Population Below the Poverty Line");
})