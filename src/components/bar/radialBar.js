import * as d3 from 'npm:d3';

export function radialBar(input, id = "heatmap") {
	let width = 600;
	let height = 400;
	const margin = {
		"bottom": 40,
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
			.attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`)
			.attr('style', `font-size: 10px; font-family: sans;`)

		let data = input.sort((a, b) => b.frequency - a.frequency)

		const innerRadius = 120;
		const outerRadius = Math.min(width, height) / 2;
		const tickCount = outerRadius / 50;

		const x = d3.scaleBand().range([0, 2 * Math.PI])
			.domain(data.map(d => d.letter))

		const y = d3.scaleRadial().range([innerRadius, outerRadius])
			.domain([0, d3.max(data, d => d.frequency)])

		// Color
		const inter = d3.interpolateRgbBasis([ '#615043','#987155', '#B89675', '#69879A', '#3C92A8'])

		const color = d3.scaleSequential(inter)
			.domain(d3.extent(data, d => d.frequency).reverse())
		// Color

		// Arc
		const arc = d3.arc().innerRadius(innerRadius)
			.outerRadius(d => y(d.frequency))
			.startAngle(d => x(d.letter))
			.endAngle(d => x(d.letter) + x.bandwidth())
			.padAngle(.01)
			.padRadius(innerRadius)
		// arc

		//xaxis
		const xAxis = graph.append('g').attr('id', 'x-axis')
			.attr('text-anchor', 'middle')
			.selectAll()
			.data(x.domain())
			.join('g')
			.attr('transform', d => `
				rotate(${(x(d) + x.bandwidth()/2) * 180/Math.PI -90})
				translate(${innerRadius},0)`)

		// xticks
		xAxis.call(g => g.append('line').attr('x2', -5).attr('stroke', '#000'))

		// x labels
		xAxis.call(g => g.append('text').attr('text-anchor', 'end')
			.attr('transform', d => (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ?
				'rotate(90)translate(0,16)' :
				'rotate(-90)translate(0,-9)')
			.text(d => d))
		// x axis 

		// y axis
		const yAxis = graph.append('g').attr('id', 'y-axis')
			.attr('text-anchor', 'end')
			.call(g => g.append('text')
				.attr('x', -6)
				.attr('y', d => -y(y.ticks(tickCount).pop()))
				.attr('dy', '-1em')
				.text('Frequency'))

		// y ticks circle
		yAxis.call(g => g.selectAll('g')
			.data(y.ticks(tickCount).slice(1))
			.join('g')
			.attr('fill', 'none')
			.call(g => g.append('circle')
				.attr('stroke', '#000')
				.attr('stroke-opacity', .3)
				.attr('r', y))
			.append('text')
			.attr('x', -5)
			.attr('y', d => -y(d))
			.attr('dy', '.35em')
			.attr('fill', '#000')
			.attr('stroke', '#fff')
			.attr('stroke-width', '5')
			.attr('paint-order', 'stroke')
			.text(y.tickFormat(null, '%'))
		)
		// y axis

		// Legend
		const colorScale = d3.scaleLinear()
			.domain(color.domain())
			.range([0, innerRadius]).nice()

		const defs = graph.append('g').attr('id', 'defs').append('defs')
		defs.append('linearGradient').attr('id', 'radial-def')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', '100%')
			.selectAll('stop')
			.data(colorScale.ticks())
			.join('stop')
			.attr('offset', (d, i, arr) => i / arr.length)
			.attr('stop-color', d => (color(d)));


		graph.append('g')
			.attr('id', 'color-legend')
			.attr('transform', `translate(-2,${-innerRadius/2})`)
			.call(d3.axisLeft(colorScale).tickSizeOuter(0).ticks(tickCount, '%'))
			.call(g => g.append('rect')
				.attr('width', 15)
				.attr('height', innerRadius).attr('transform', 'translate(0,2)')
				.attr('fill', 'url(#radial-def)'))
		// Legend

		// bars 
		const bars = graph.append('g')
			.selectAll()
			.data(data)
			.join('g')
			.attr('fill', d => color(d.frequency))

		// bar path
		bars.call(g => g.append('path').attr('class','rbar')
			.attr('fill-opacity', .9)
			.attr('d', arc))
		//bar annotation
		bars.call(g => g.append('g')
			.attr('text-anchor', d => (x(d.letter) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ?
				"end" : "start")
			.attr('transform', d => `
				rotate(${(x(d.letter) + x.bandwidth()/ 2) * 180/Math.PI-90})
				translate(${y(d.frequency)+2},0)`)
			.append('text')
			.attr('transform', d => (x(d.letter) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ?
				'rotate(180)' :
				'rotate(0)')
			.attr('alignment-baseline', 'middle')
			.attr('fill-opacity', 1).text(d => d3.format(".1%")(d.frequency))
		) // bars



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