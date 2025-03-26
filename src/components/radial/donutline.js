import * as d3 from 'npm:d3';
export function donutLine(input, id = "donut-line") {
	let width = 700;
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

		const hoverOpacity = .3;
		const defaultOpacity = .9;

		let radius = Math.min(width, height) / 2 - 1;

		const color = d3.scaleOrdinal()
			.domain(groups)
			.range(d3.quantize(d3.interpolateViridis, groups.length + 1))

		const pie = d3.pie()
			.sort(null)
			.value(d => d.value)
			.startAngle(0)
			.endAngle(2 * Math.PI)

		const radiusScale = d3.scaleLinear()
			.domain(d3.extent(input, d => d.value))
			.range([radius * .55, radius * .75])

		const arc = d3.arc()
			.innerRadius(radius * .5)
			.outerRadius(d => radiusScale(d.value))
			.padRadius(radius * .25)
			.padAngle(2 / (radius * .25))
			.cornerRadius(8)


		const data = pie(input)

		const lradius = radius * .75;

		const sarc = d3.arc()
			.innerRadius(radius * .5)
			.outerRadius(d => radiusScale(d.value))

		const larc = d3.arc()
			.innerRadius(lradius)
			.outerRadius(lradius)

		// Paths
		const path = graph.append('g')
			.selectAll('path')
			.data(data)
			.join('path')
			.attr('fill', d => color(d.data.name))
			.attr('fill-opacity', defaultOpacity)


		path.transition()
			.duration(1000)
			.ease(d3.easeCubicOut)
			.attrTween('d', arcTween)

		// Polyline
		const polyline = graph.append('g')
			.selectAll()
			.data(data)
			.join('g')

		const line = polyline.append('polyline')
			.attr('stroke', d => color(d.data.name))
			.attr('stroke-width', 2)
			.attr('fill', 'none')
			.attr('points', function(d) {
				const posc = larc.centroid(d);
				d.midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				posc[0] = lradius * (d.midAngle < Math.PI ? 1 : -1);
				return [sarc.centroid(d), larc.centroid(d), posc];
			});
		
		polyline.append('text')
			.attr('transform', d => {
				const pos = larc.centroid(d);
				pos[0] = lradius * (d.midAngle < Math.PI ? 1 : -1);
				return `translate(${pos})`;
			})
			.attr('text-anchor', d => d.midAngle < Math.PI ? 'start' : 'end')
			.text(d => d.data.name);


		// Hover effects 

		// Arcs
		path.on('mouseenter', highlight).on('mouseleave', removeHighlights)

		// Lines
		polyline.on('mouseenter', highlight).on('mouseleave', removeHighlights)

		function highlight(event, e) {
			polyline
				.attr('fill-opacity', hoverOpacity)
				.attr('stroke-opacity', hoverOpacity)
			polyline.filter(d => d.data.name === e.data.name)
				.attr('fill-opacity', defaultOpacity)
				.attr('stroke-opacity', defaultOpacity)
				.attr('font-weight', 'bold')
				.attr('font-size', '12px')

			path.attr('fill-opacity', hoverOpacity)
			path.filter(d => d.data.name === e.data.name)
				.attr('fill-opacity', defaultOpacity)
		}

		function removeHighlights(event, e) {
			path.attr('fill-opacity', defaultOpacity)
			polyline.attr('fill-opacity', defaultOpacity)
				.attr('stroke-opacity', defaultOpacity)
				.attr('font-weight', 'normal')
				.attr('font-size', '10px')
		}

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