import * as d3 from 'npm:d3';

export function DivergeBar(input, id = "dibar") {
	let width = 500;
	let height = 800;
	const margin = {
		"bottom": 50,
		"top": 40,
		"right": 30,
		"left": 40
	};
	const container = d3.create('div')
		.style('position', 'relative')
		.style('width', width + margin.right + margin.left + 'px');

	const data = d3.sort(input, d => d[2019] - d[2010]).map(d => ({
		...d,
		value: (d[2019] - d[2010]) / d[2010]
	}))

	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		// Main chart
		const graph = container.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		const format = d3.format('+.0%')
		const x = d3.scaleLinear().domain(d3.extent(data, d => d.value))
			.rangeRound([0, width]);
		const xTicks = d3.axisTop(x).tickSizeOuter(0).ticks(width / 40).tickFormat(format);
		graph.append('g')
			.attr('id', 'x-axis')
			.call(xTicks)
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line')
				.clone()
				.attr('stroke-opacity', .2)
				.attr('y2', height))

		const y = d3.scaleBand().domain(data.map(d => d.State))
			.rangeRound([height, 0]).padding(.2);
		const yTicks = d3.axisLeft(y).tickSize(0).tickPadding(5)
		graph.append('g')
			.attr('transform', `translate(${x(0)})`)
			.call(yTicks)
			.call(g => g.selectAll('.tick text').filter((d, i) => data[i].value < 0)
				.attr('text-anchor', 'start')
				.attr('x', 5))

		graph.append('g')
			.selectAll()
			.data(data)
			.join('rect')
			.attr('fill', d => d3.schemeRdBu[3][d.value > 0 ? 2 : 0])
			.attr('x', d => x(Math.min(d.value, 0)))
			.attr('y', d => y(d.State))
			.attr('width', d => Math.abs(x(d.value) - x(0)))
			.attr('height', y.bandwidth())
		graph.append('g')
			.attr('font-size', 10)
			.selectAll()
			.data(data)
			.join('text')
			.attr('text-anchor', d => d.value < 0 ? 'end' : 'start')
			.attr('x',d=>x(d.value)+Math.sign(d.value-0)*2)
			.attr('dy','.4em')
			.attr('y',d=>y(d.State)+y.bandwidth()/2)
			.text(d=>format(d.value))

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