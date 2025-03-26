import * as d3 from 'npm:d3';
export function donutChart(input, id = "donut-chart") {
	let width = 500;
	let height = width;
	const margin = {
		"bottom": 20,
		"top": 40,
		"right": 20,
		"left": 40
	};

	const container = d3.create('div')
		.style('position', 'relative')
		.style('width', width + margin.right + margin.left + 'px');


	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		// Main chart
		const graph = container.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left + width/2},${margin.top + height/2})`)
			.attr('style', `font-size: 10px; font-family: sans-serif;`);

		const groups = input.map(d => d.name)

		let radius = Math.min(width, height) / 2 - 1;

		const color = d3.scaleOrdinal()
			.domain(groups)
			.range(d3.quantize(d3.interpolateCool, groups.length + 1))

		const pie = d3.pie()
			.sort(null)
			.value(d => d.value)
			.startAngle(0)
			.endAngle(2 * Math.PI)

		const arc = d3.arc()
			.innerRadius(radius * .5)
			.outerRadius(radius)
			.padRadius(radius * .25)
			.padAngle(1 / (radius * .25))
			.cornerRadius(8)

		const data = pie(input)
		const lradius = radius * .65;

		const larc = d3.arc()
			.innerRadius(lradius)
			.outerRadius(lradius)

		const path = graph.append('g')
			.selectAll('path')
			.data(data)
			.join('path')
			.attr('fill', d => color(d.data.name))
			.attr('fill-opacity', .9)
			.attr('d', arc)

		path.on('mouseenter', function(event, e) {
			path.attr('fill-opacity', .5)
			path.filter(d => d.data.name === e.data.name)
				.attr('fill-opacity', 1)
		}).on('mouseleave', function(event, e) {
			path.attr('fill-opacity', .9)
		})
		path.transition()
			.duration(1000)
			.ease(d3.easeCubicOut)
			.attrTween('d', arcTween)

		graph.append('g')
			.selectAll('text')
			.data(data)
			.join('text')
			.attr('transform', d => `translate(${larc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.attr('font-weight', 'bold')
			.attr('fill-opacity', .9)
			.text(d => d.data.name)
			.call(t => t.filter(d => (d.endAngle - d.startAngle) > Math.PI / (data.length + 8))
				.append('tspan')
				.attr('x', 0)
				.attr('fill-opacity', .5)
				.attr('y', '1.2em')
				.text(d => d3.format('.3s')(d.data.value)))

		function arcTween(d) {
			const interpolateEnd = d3.interpolate(0, d.endAngle);
			const interpolateStart = d3.interpolate(0, d.startAngle);
			return function(t) {
				d.endAngle = interpolateEnd(t);
				d.startAngle = interpolateStart(t)
				return arc(d);
			}
		}
		return container.node();
	}
	chart.size = function([w, h]) {
		if (!arguments.length) return width;
		width = w;
		height = h;
		return chart;
	}

	return chart;
}