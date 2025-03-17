import * as d3 from 'npm:d3';

export function Timeline(input, id = "timeline") {
	let width = 600;
	let height = 400;
	const margin = {
		"bottom": 20,
		"top": 40,
		"right": 20,
		"left": 20
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
			.attr('style', `font-size: 10px; font-family: sans;`)

		let data = input.sort((a, b) => b.start - a.start)
		const timeGroup = data.map(d => d.civilization)

		data = d3.groups(data, d => d.region)
		data.sort((a, b) => d3.sum(b[1], d => d.start) - d3.sum(a[1], d => d.start))


		const regionGroup = [];
		data.forEach(d => {
			d[1].forEach(d => regionGroup.push(d.civilization))
		})

		// Scale
		const x = d3.scaleLinear()
			.range([0, width]).nice()
			.domain([d3.min(input, d => d.start), d3.max(input, d => d.end)])
		const y = d3.scaleBand()
			.domain(regionGroup)
			.rangeRound([height, 0])
			.padding(.12)
		// Scale

		// Color
		const c = new Set(input.map(d => d.region))

		const inter = d3.interpolateRgbBasis(['#B89675', '#987155', '#615043', '#69879A', '#3C92A8'])
		const color = d3.scaleOrdinal()
			.range(d3.quantize(inter, c.size))
			.domain(c)
		// Color

		//axis
		graph.append('g')
			.call(d3.axisTop(x)
				.tickSizeOuter(0)
				.tickFormat(d => d >= 0 ? `${d} AD` : `${-d} BC`))
			.call(g => g.selectAll('.tick line').attr('y2', height).attr('stroke-opacity', .2))

		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d => d >= 0 ? `${d} AD` : `${-d} BC`))

		const line = graph.append('line')
			.attr('x1', x(0))
			.attr('x2', x(0))
			.attr('y1', 0)
			.attr('y2', height)
			.attr('stroke', '#000')
			.attr('stroke-opacity', .5)
		// axis
		const rectGroup = graph.append('g').attr('id', 'rect-group')
		const textGroup = graph.append('g').attr('id', 'text-group')

		update(data)

		//Legend 

		graph.append('g')
			.attr('transform', `translate(5,${height* .82})`)
			.selectAll('.legend-tile')
			.data(color.domain())
			.join('g')
			.attr('class', 'legend-tile')
			.attr('fill', d => color(d))
			.attr('transform', (d, i) => `translate(0,${i*18})`)
			.call(g => g.append('circle')
				.attr('r', 7.5)
				.attr('stroke-width', 1.6)
				.attr('stroke-opacity', .6)
				.attr('stroke', d => color(d))
				.attr('fill', 'none'))
			.call(g => g.append('circle')
				.attr('r', 5.3))

			.call(g => g.append('text')
				.attr('dy', '.4em')
				.attr('dx', '.3em')
				.attr('x', 10)
				.attr('stroke', 'none')
				.attr('paint-order', 'stroke')
				.attr('text-anchor', 'start')
				.text(d => d))
		//Legend
		function update(data) {
			const gR = rectGroup.selectAll('g')
				.data(data)
				.enter().append('g')
				.attr('fill', d => color(d[0]))

			const gT = textGroup.selectAll('.time-label')
				.data(input)

			// time bars 
			const timeline = gR.selectAll('rect')
				.data(d => d[1])
				.enter().append('rect')
				.attr('class', 'timeline')
				.attr('y', (d, i) => y(d.civilization))
				.attr('height', 10)
				.attr('width', d => x(d.end) - x(d.start))

			gR.merge(timeline) // Merge
			gR.merge(gR) // Merge

			gR.exit().transition().remove()
			timeline.transition()
				.duration(1000)
				.ease(d3.easeQuad)
				.attr('x', d => x(d.start))
				.attr('fill-opacity', .9)

			timeline.exit().transition().remove() // Exit

			// time 

			// Text label 
			const text = gT.enter().append('text')
				.attr('class', 'time-label')
				.attr('y', (d) => y(d.civilization))
				.attr('dy', y.bandwidth() / 2 + 1)
				.text(d => d.civilization)

			gT.merge(text)

			text.transition()
				.duration(1050)
				.ease(d3.easeQuad)
				.attr('x', placeTextX)
				.attr('fill-opacity', 1)
				.attr('text-anchor', d => d.pos ? 'start' : 'end')

			gT.exit().transition().remove() // Exit
			// Text label
		}


		function placeTextX(d) {
			const pos = x(d.start)
			if (pos < 120) {
				d.pos = 'start'
				return x(d.end) + 5
			}
			return x(d.start) - 5
		}
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