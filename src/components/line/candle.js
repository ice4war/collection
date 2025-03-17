import * as d3 from 'npm:d3';

export function candleChart(input, id = "slopeline") {
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

	const data = input.slice(0);


	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		const x = d3.scaleUtc()
			.range([0, width])
			.domain(d3.extent(data, d => d.timestamp))

		const y = d3.scaleLog()
			.range([height, 0])
			.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])

		// Main chart
		const graph = container.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('style', `font-size: 10px; font-family: sans-serif;`);

		// x-axis
		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		graph.append('g')
			.call(d3.axisLeft(y).ticks(null, "s").tickSizeOuter(0))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone()
				.attr('x2', width)
				.attr('stroke-opacity', .2))

		const g = graph.append('g')
			.attr('stroke-linecap', 'round')
			.attr('stroke', '#000')
			.attr('fill', 'none')
			.selectAll('g')
			.data(data)
			.join('g')
			.attr('transform', d => `translate(${x(d.timestamp)})`)

		g.append('line')
			.attr('stroke-opacity', .7)
			.attr('y1', d => y(d.low))
			.attr('y2', d => y(d.high))
		g.append('line')
			.attr('y1', d => y(d.open))
			.attr('stroke-opacity', .8)
			.attr('y2', d => y(d.close))
			.attr('stroke-width', Math.ceil(width / (data.length / .7)))
			.attr('stroke', d => d.open > d.close ?
				'green' : d.close > d.open ? 'red' : '#ccc')
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