import * as d3 from 'npm:d3';

export function areaChart(data) {
	let width = 700;
	let height = width * .6;
	const margin = {
		"bottom": 50,
		"top": 40,
		"right": 20,
		"left": 50
	};

	const container = d3.create('div')
		.style('position', 'relative')
		.style('height', height + margin.top + margin.bottom + 'px')
		.style('width', width + margin.right + margin.left + 'px');

	const tooltip = container.append('div')
		.attr('style', `position: absolute;
			opacity:0;
			top:0;
			right:0;
			padding: .2em;
			border: 1px solid #888;`);

	let color = d3.scaleLinear()
		.domain(d3.extent(data, d => d.close))
		.range(['#FF4E50', '#F9D423']);


	function chart() {
		container.style('height', height + margin.top + margin.bottom + 'px')
			.style('width', width + margin.right + margin.left + 'px');

		const graph = container.append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleUtc().domain(d3.extent(data, d => d.date)).range([0, width]);
		const y = d3.scaleLinear().domain([0, d3.max(data, d => d.close)]).range([height, 0]);

		graph.append('linearGradient').attr('id', 'area')
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('y1', 0)
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y2', '100%')
			.selectAll('stop')
			.data(data)
			.join('stop')
			.attr('offset', (d, i, arr) => i / arr.length)
			.attr('stop-color', d => color(d.close));
		const xAxis = d3.axisBottom(x).tickSizeOuter(0).ticks(width / 40);

		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
		graph.append('g')
			.call(d3.axisLeft(y).ticks(height / 40))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone().attr('x2', width).attr('stroke-opacity', .15))

		const labels = graph.append('g').attr('id', 'labels')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', -margin.right)
			.attr('dx', '-1em')
			.attr('y', '-1em')
			.attr('text-anchor','start')
			.text('Close')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', width-margin.right)
			.attr('y', height)
			.attr('dx', '-1em')
			.attr('dy', '2.2em')
			.attr('text-anchor','end')
			.text('Date')


		const area = d3.area()
			.x(d => x(d.date)).y0(d => y(0)).y1(d => y(d.close));

		const p = graph.append('g')
			.append('path')
			.datum(data)
			.attr('stroke', 'url(#area)')
			.attr('fill', 'url(#area)')
			.attr('fill-opacity', .8)
			.attr('stroke-opacity', 1)
			.attr('stroke-width', 1.5)
			.attr('d', area);

		return container.node();
	}

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		height = width * .6;
		return chart;
	}

	return chart;
}