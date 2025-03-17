import * as d3 from 'npm:d3';

export function StackHBar(input, id = "stackhbar") {
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

		const data = d3.stack()
			.keys(d3.union(input.map(d => d.age)))
			.value(([, D], key) => D.get(key).population)
			(d3.index(input, d => d.state, d => d.age))

		const y = d3.scaleBand()
			.domain(d3.groupSort(input, g => d3.sum(g, d => d.population), d => d.state))
			.range([height, 0])
			.padding(.1)

		const x = d3.scaleLinear().domain([0, d3.max(data, D => d3.max(D, d => d[1]))])
			.range([0, width])

		graph.append('g')
			.attr('id', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0).ticks(null, 's'))
		graph.append('g')
			.attr('id', 'y-axis')
			.call(d3.axisLeft(y).tickSizeOuter(0))

		const color = d3.scaleOrdinal()
			.domain(data.map(d => d.key))
			.range(d3.quantize(d3.interpolateSpectral, data.length + 1))
			.unknown('#ccc')

		graph.append('g')
			.selectAll()
			.data(data)
			.join('g')
			.attr('fill', d => color(d.key))
			.selectAll()
			.data(D => D.map(d => (d.key = D.key, d)))
			.join('rect')
			.attr('x', d => x(d[0]))
			.attr('y', d => y(d.data[0]))
			.attr('height', y.bandwidth)
			.attr('width', d => x(d[1]) - x(d[0]))

		const legendG = graph.append('g').attr('id', 'legend')
			.attr('transform', `translate(${width/1.08},${height/1.5})`)

		const legendX = d3.scaleBand()
			.domain(color.domain())
			.range([0, height / margin.bottom * 12]).padding(.05)
		
		const fs = Math.round(height%legendX.bandwidth())
		
		legendG.append('g')
			.call(d3.axisLeft(legendX))
			.call(g => g.select('.domain').remove())
			.call(g=>g.selectAll('.tick text').attr('font-size',fs))

		legendG.append('text')
			.attr('y', -10)
			.attr('x', -10)
			.attr('text-anchor', 'start')
			.text('Age')
		legendG.append('g')
			.selectAll()
			.data(color.domain())
			.join('rect')
			.attr('y', d => legendX(d))
			.attr('height', legendX.bandwidth)
			.attr('width', legendX.bandwidth)
			.attr('fill', d => color(d))

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