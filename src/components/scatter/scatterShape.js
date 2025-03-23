import * as d3 from 'npm:d3';

export function scatterShape(input) {
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

	const tooltip = container.append('div')
		.attr('style', `position: absolute;
			opacity:0;
			top:0;
			right:0;
			padding: .2em;
			border: 1px solid #888;`);

	function chart() {
		const data = input;
		container.style('width', width + margin.right + margin.left + 'px');

		const graph = container.append('figure').append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const labels = graph.append('g').attr('id', 'labels')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', -margin.right)
			.attr('dx', '-1em')
			.attr('y', '-1em')
			.attr('text-anchor', 'start')
			.text('Hp')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', width - margin.right)
			.attr('y', height)
			.attr('dx', '-1em')
			.attr('dy', '2.6em')
			.attr('text-anchor', 'end')
			.text('Mpg')

		// Key
		const key = 'carb';
		const c = new Set(data.map(d => d[key]))
		// Color
		const color = d3.scaleOrdinal()
			.domain(c)
			.range(d3.quantize(d3.interpolateViridis, c.size + 1))

		const shape = d3.scaleOrdinal()
			.domain(c)
			.range(d3.symbols.map(d => d3.symbol(d)))
		const x = d3.scaleLinear()
			.domain(d3.extent(data, d => d.mpg))
			.rangeRound([0, width]).nice()

		const y = d3.scaleLinear()
			.domain(d3.extent(data, d => d.hp))
			.range([height, 0]).nice()

		const xAxis = d3.axisBottom(x).tickSizeOuter(0).ticks(width / 50)
		const yAxis = d3.axisLeft(y).tickSizeOuter(0).ticks(height / 40)

		graph.append('g')
			.attr('id', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
			.call(g => g.selectAll('.tick line').clone()
				.attr('y2', height)
				.attr('stroke-opacity', .1)
				.attr('transform', `translate(0,${-height})`))


		graph.append('g')
			.attr('id', 'y-axis')
			.call(yAxis)
			.call(g => g.selectAll('.tick line').clone()
				.attr('x2', width)
				.attr('stroke-opacity', .1))

		const lgx = graph.append('g')
		const lgy = graph.append('g')
		const xl = lgx.append('line').attr('y1', height)
		const yl = lgy.append('line').attr('x1', 0)
		lgx.append('text').attr('class', 'x-legend')
		lgy.append('text').attr('class', 'y-legend')

		const legend = graph.append('g')
			.attr('id', 'legend')
			.attr('transform', `translate(${width*.85},${margin.top/2 * 1.7})`)
			.call(g => g.append('text')
				.attr('y', -margin.top / 3)
				.attr('text-anchor', 'start')
				.style('text-transform', 'capitalize')
				.style('font-weight', 'bold')
				.text(key))
			.selectAll()
			.data(color.domain())
			.join('g')
			.attr('class', 'legend-g')

		legend.call(g => g.append('path')
				.attr('d', d => shape(d)())
				.attr('transform', (d, i) => `translate(0,${(i*15)})`)
				.attr('fill', d => color(d)))
			.call(g => g.append('text')
				.attr('d', d => shape(d)())
				.attr('x', 10)
				.attr('dy', '.35em')
				.attr('y', (d, i) => i * 15)
				.attr('fill', d => color(d))
				.text(d => d))


		graph.append('g')
			.selectAll('path')
			.data(data)
			.join('path')
			.attr('d', d => shape(d[key])())
			.attr('fill', d => color(d[key]))
			.attr('transform', d => `translate(${x(d.mpg)},${y(d.hp)})`)
			.on('mouseover', function(event, d) {
				d3.select(this).attr('stroke', color(d[key]))
					.attr('stroke-opacity', .3)
					.attr('stroke-width', 10);
				const xpos = x(d.mpg)
				const ypos = y(d.hp)

				xl.attr('x1', xpos).attr('x2', xpos)
					.attr('y2', ypos)
					.attr('stroke', color(d[key]))
					.attr('stroke-opacity', .7)
				yl.attr('x2', xpos).attr('y2', ypos)
					.attr('y1', ypos)
					.attr('stroke', color(d[key]))
					.attr('stroke-opacity', .7)

				lgx.select('.x-legend')
					.attr('text-anchor', 'middle')
					.attr('x', xpos)
					.attr('dx', '.1em')
					.attr('y', height)
					.attr('fill', color(d[key]))
					.attr('stroke', '#fff')
					.attr('stroke-width', 3)
					.attr('paint-order', 'stroke')
					.text(d.mpg)

				lgy.select('.y-legend')
					.attr('text-anchor', 'start')
					.attr('x', 0)
					.attr('y', ypos)
					.attr('dy', '.2em')
					.attr('fill', color(d[key]))
					.attr('stroke', '#fff')
					.attr('stroke-width', 3)
					.attr('paint-order', 'stroke')
					.text(d.hp)
			})
			.on('mouseleave', function(event, d) {
				d3.select(this).attr('stroke', 'none');
				xl.attr('stroke', 'none')
				yl.attr('stroke', 'none')
				lgy.select('.y-legend').text('')
				lgx.select('.x-legend').text('')

			})
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