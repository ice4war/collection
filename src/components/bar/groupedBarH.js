import * as d3 from 'npm:d3';

export function GroupedBarH(input, id = "stackbar") {
	let width = 600;
	let height = 400;
	const margin = {
		"bottom": 50,
		"top": 40,
		"right": 30,
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

		const ages = new Set(input.map(d => d.age))

		const fy = d3.scaleBand().rangeRound([height, 0])
			.domain(new Set(input.map(d => d.state)))
			.paddingInner(.1)

		const y = d3.scaleBand()
			.domain(ages)
			.range([0, fy.bandwidth()])
			.padding(0.01)

		const x = d3.scaleLinear()
			.domain([0, d3.max(input, d => d.population)]).nice()
			.rangeRound([0, width])

		const color = d3.scaleOrdinal()
			.domain(ages)
			.range(d3.quantize(d3.interpolateSpectral, ages.size + 1))
			.unknown('#ccc')

		graph.append('g')
			.call(d3.axisTop(x).ticks(null, 's'))
			.call(g => g.selectAll('.tick line').clone()
				.attr('y2', height)
				.attr('stroke-opacity',.2))

		graph.append('g')
			.call(d3.axisLeft(fy))
			.call(g => g.select('.domain').remove())

		graph.append('g')
			.selectAll()
			.data(d3.group(input, d => d.state))
			.join('g')
			.attr('transform', ([d]) => `translate(0,${fy(d)})`)
			.selectAll()
			.data(([, O]) => O)
			.join('rect')
			.attr('fill', d => color(d.age))
			.attr('x', d => x(0))
			.attr('y', d => y(d.age))
			.attr('height', y.bandwidth())
			.attr('width', d => x(d.population))

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