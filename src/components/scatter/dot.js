import * as d3 from 'npm:d3';

export function dotPlot(input) {
	let width = 700;
	let height = width * .5;
	const margin = {
		"bottom": 50,
		"top": 40,
		"right": 20,
		"left": 50
	};

	const container = d3.create('div')
		.style('position', 'relative')
		.style('height', 'fit-content')


	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		const graph = container.append('figure').append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const labels = graph.append('g').attr('id', 'labels')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', width)
			.attr('dx', '-1em')
			.attr('y', '-2em')
			.attr('text-anchor', 'end')
			.text('Population %')


		const keys = input.columns.slice(1)
		const color = d3.scaleOrdinal()
			.domain(keys)
			.range(d3.quantize(d3.interpolateSpectral, keys.length))

		const total = new Map(input.map(d => [d.name, d3.sum(keys, g => d[g])]))

		const data = keys.flatMap(age => input.map(d => ({
			state: d.name,
			age,
			population: d[age],
			percent: d[age] / total.get(d.name)
		})))

		const states = d3.group(data, d => d.state)
		const x = d3.scaleLinear()
			.domain(d3.extent(data, d => d.percent))
			.rangeRound([0, width])
			.nice()

		const y = d3.scalePoint()
			.domain(d3.sort(states.keys()))
			.rangeRound([height, 0])
			.padding(1)

		graph.append('g')
			.call(d3.axisTop(x).ticks(null, '%'))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone().attr('y2', height).attr('stroke-opacity', .2))
		
		graph.append('g')
		.attr('transform',`translate(0,${height})`)
			.call(d3.axisBottom(x).ticks(null, '%'))
			.call(g => g.select('.domain').remove())
		const legend = graph.append('g')

		const g = graph.append('g')
			.selectAll('g')
			.data(states)
			.join('g')
			.attr('transform', ([n, a]) => `translate(0,${y(n)})`)

		g.append('text')
			.attr('font-size', '10px')
			.attr('text-anchor', 'end')
			.attr('dx', -6)
			.attr('dy', 3)
			.attr('x', ([, val]) => x(d3.min(val, d => d.percent)))
			.text(([n, ]) => n)
		g.append('line')
			.attr('stroke', '#000')
			.attr('x1', ([, val]) => x(d3.min(val, d => d.percent)))
			.attr('x2', ([, val]) => x(d3.max(val, d => d.percent)))
		g.append('g')
			.selectAll('circle')
			.data(([, v]) => v)
			.join('circle')
			.attr('cx', d => x(d.percent))
			.attr('r', Math.floor(height / 200))
			.attr('fill', d => color(d.age))
			.attr('fill-opacity', .8)

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