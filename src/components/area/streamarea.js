import * as d3 from 'npm:d3';

export function streamArea(input, id = 'streamarea') {
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

	const data = input;

	function chart() {
		container.style('height', height + margin.top + margin.bottom + 'px')
			.style('width', width + margin.right + margin.left + 'px');

		const graph = container.append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const industry = new Set(data.map(d => d.industry))

		const series = d3.stack()
			.offset(d3.stackOffsetWiggle)
			.order(d3.stackOrderInsideOut)
			.keys(industry)
			.value(([, D], key) => D.get(key).unemployed)
			(d3.index(data, d => d.date, d => d.industry))

		const color = d3.scaleOrdinal().domain(industry)
			.range(d3.quantize(d3.interpolateViridis, industry.size + 1))

		const x = d3.scaleUtc()
			.domain(d3.extent(data, d => d.date))
			.range([0, width])

		const y = d3.scaleLinear()
			.domain(d3.extent(series.flat(2)))
			.range([height, 0]).nice()

		graph.append('g')
			.selectAll('path')
			.data(series)
			.join('path')
			.attr('fill', d => color(d.key))
			.attr('d', d3.area().x(d => x(d.data[0]))
				.y0(d => y(d[0]))
				.y1(d => y(d[1])))

		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0).ticks(null))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone()
				.attr('y2', -height)
				.attr('stroke-opacity', .15))
		graph.append('g')
			.call(d3.axisLeft(y).tickSizeOuter(0))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone()
				.attr('x2', width)
				.attr('stroke-opacity', .15))


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