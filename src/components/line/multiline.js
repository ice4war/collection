import * as d3 from 'npm:d3';

export function multiLine(input, id = "multiline") {
	let width = 600;
	let height = 400;
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
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('style', `font-size: 10px; font-family: open-sans;`);


		const line = d3.line()

		const x = d3.scaleUtc().domain(d3.extent(input, d => d.date))
			.range([0, width])

		const y = d3.scaleLinear().domain([0, d3.max(input, d => d.unemployment)])
			.range([height, 0])

		const points = input.map(d => [x(d.date), y(d.unemployment), d.division]);

		const groups = d3.groups(points, d => d[2])
		const colorSet = groups.map(d => d[0])

		const interBlPu = d3.interpolateRgbBasis([
			'#3D95CC',
			'#338ECC',
			'#1579B8',
			'#3D73C2',
			'#3768A6',
			'#7A79C0',
			'#B59ECD',
			'#B385B2',
			'#AC7DC5',
			'#5B5484',
			'#78479F'
		])
		const color = d3.scaleOrdinal()
			.range(d3.quantize(interBlPu, colorSet.length))
			.domain(colorSet)

		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))

		graph.append('g')
			.call(d3.axisLeft(y))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone()
				.attr('x2', width)
				.attr('stroke-opacity', .2))

		// graph.append('path')
		// 	.attr('fill', 'none')
		// 	.attr('stroke', '#ccc')
		// 	.attr('d', d3.Delaunay
		// 		.from(points)
		// 		.voronoi([0, 0, width, height])
		// 		.render())
		const path = graph.append('g')
			.attr('fill', 'none')
			.attr('stroke-width', 1.2)
			.attr('stroke-opacity', .9)
			.selectAll('path')
			.data(groups)
			.join('path')
			.attr('class', 'multiline')
			.attr('stroke', d => color(d[0]))
			.attr('d', d => line(d[1]))
			.style('mix-blend-mode', 'multiply')

		const dot = graph.append('g')
			.style('display', 'none')
		dot.append('circle')
			.attr('r', 2.6)
		dot.append('text')
			.attr('text-anchor', 'middle')
			.attr('y', -9)

		path.on('pointerenter', function(event, d) {
				path.style('mix-blend-mode', null)
				dot.style('display',null)
			})
			.on('pointermove', function(event) {
				const [xm, ym] = d3.pointer(event);
				const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym))
				const [x, y, k] = points[i];

				path.style('stroke', ([n, ar]) => n == k ? null : '#ddd')
					.filter(([n, ]) => n == k).raise()
				dot.attr('fill',color(k)).attr('transform', `translate(${x},${y})`)
				dot.select('text').text(k)
				graph.dispatch()
			})
			.on('pointerleave', function(event) {
				path.style('mix-blend-mode', 'multiply').style('stroke', null)
				dot.style('display','none')

			})

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