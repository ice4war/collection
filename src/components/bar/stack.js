import * as d3 from 'npm:d3';

export function StackBar(input, id = "stackbar") {
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

		const x = d3.scaleBand()
			.domain(d3.groupSort(input, g => -d3.sum(g, d => d.population), d => d.state))
			.range([0, width])
			.padding(.1)
		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, D => d3.max(D, d => d[1]))])
			.range([height, 0])
		graph.append('g')
			.call(d3.axisLeft(y).ticks(null, 's').tickSizeOuter(0))

		const color = d3.scaleOrdinal()
			.domain(data.map(d => d.key))
			.range(d3.quantize(d3.interpolateSpectral, data.length + 1))
			.unknown('#ccc')

		const barGroup = graph.append('g')
			.selectAll()
			.data(data)
			.join('g')
			.attr('fill', d => color(d.key))

		const bars = barGroup.selectAll('rect')
			.data(D => D.map(d => (d.key = D.key, d)))
			.join('rect')
			.attr('class', d => `${d.data[0]} gb`)
			.attr('x', d => x(d.data[0]))
			.attr('y', d => y(d[1]))
			.attr('width', x.bandwidth)
			.attr('height', d => y(d[0]) - y(d[1]))
			.attr('fill-opacity', .9)

		bars.on('mouseover', function(event, d) {
			d3.selectAll('.gb').attr('fill-opacity', .5)
			d3.selectAll(`.${d.data[0]}`).attr('fill-opacity', 1)
		}).on('mouseleave', function(event, d) {
			d3.selectAll('.gb').attr('fill-opacity', .9)
		})
		const legendG = graph.append('g').attr('id', 'legend')
			.attr('transform', `translate(${width/1.5},0)`)


		const legendX = d3.scaleBand()
			.domain(color.domain())
			.range([0, 270]).padding(.1)

		legendG.append('g')
			.call(d3.axisBottom(legendX))
			.call(g => g.select('.domain').remove())

		legendG.append('text')
			.attr('y', -20)
			.attr('x', 20)
			.attr('text-anchor', 'start')
			.text('Age')
		legendG.append('g')
			.attr('transform', `translate(0,${-12})`)
			.selectAll()
			.data(color.domain())
			.join('rect')
			.attr('x', d => legendX(d))
			.attr('width', legendX.bandwidth)
			.attr('fill', d => color(d))
			.attr('height', legendX.bandwidth()/2)

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