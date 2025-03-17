import * as d3 from 'npm:d3';

export function GroupedBar(input, id = "stackbar") {
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

		const fx = d3.scaleBand().rangeRound([0, width])
			.domain(new Set(input.map(d => d.state)))
			.paddingInner(.1)

		const x = d3.scaleBand()
			.domain(ages)
			.range([0, fx.bandwidth()])
			.padding(.05)

		const y = d3.scaleLinear()
			.domain([0, d3.max(input, d => d.population)]).nice()
			.rangeRound([height, 0])

		const color = d3.scaleOrdinal()
			.domain(ages)
			.range(d3.quantize(d3.interpolateSpectral, ages.size + 1))
			.unknown('#ccc')

			graph.append('g')
				.attr('transform',`translate(0,${height})`)
				.call(d3.axisBottom(fx))
				.call(g=>g.select('.domain').remove())

			graph.append('g')
				.call(d3.axisLeft(y).ticks(null,'s'))

			graph.append('g')
				.selectAll()
				.data(d3.group(input,d=>d.state))
				.join('g')
				.attr('transform',([d])=>`translate(${fx(d)},0)`)
				.selectAll()
				.data(([,O])=>O)
				.join('rect')
				.attr('fill',d=>color(d.age))
				.attr('x',d=>x(d.age))
				.attr('y',d=>y(d.population))
				.attr('width',x.bandwidth())
				.attr('height',d=>y(0)-y(d.population))
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