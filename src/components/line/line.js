import * as d3 from 'npm:d3';

export function lineChart(input) {
	let width = 700;
	let height = 300;
	const margin = {
		"bottom": 50,
		"top": 50,
		"right": 20,
		"left": 50
	};


	const container = d3.create('div')
		.style('position', 'relative')
		.style('height', height + margin.top + margin.bottom + 'px')
		.style('width', width + margin.right + margin.left + 'px');
	const tooltip = container.append('div')
		.attr('style', `position: absolute;
			opacity:0;
			top:0;
			right:0;
			padding: .2em;
			border: 1px solid #888;`);



	function chart() {
		container.style('height', height + margin.top + margin.bottom + 'px')
			.style('width', width + margin.right + margin.left + 'px');

		const graph = container.append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		const data = input.map(d => ({
			...d,
			close: d.date.getUTCMonth() < 3 ? NaN : d.close
		}));

		let color = d3.scaleLinear()
			.domain(d3.extent(data, d => d.close))
			.range(['#FF4E50', '#F9D423'])
		const lineGen = d3.line().x(d => x(d.date)).y(d => y(d.close))
			.defined(d => !isNaN(d.close))

		const defs = graph.append('defs');

		const x = d3.scaleUtc().domain(d3.extent(data, d => d.date)).range([0, width]);
		const y = d3.scaleLinear().domain(d3.extent(data, d => d.close)).range([height, 0]);
		const xTicks = d3.axisBottom(x).tickSizeOuter(0).ticks(width / 50);

		const brush = d3.brushX().extent([
			[0, 0],
			[width, height]
		]).on('end', brushed)

		graph.on('dblclick', function() {
			x.domain(d3.extent(data, d => d.date))
			xAxis.transition().call(xTicks)
			line.select('.brush-missingline').transition().duration(522).attr('d', lineGen(data))
			line.select('.brush-line').transition().duration(500).attr('d', lineGen(data.filter(d => !isNaN(d.close))))
		})


		defs.append('clipPath')
			.attr('id', 'line-clip')
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', width)
			.attr('height', height);

		defs.append('linearGradient').attr('id', 'line')
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('y1', 0)
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y2', '100%')
			.selectAll('stop')
			.data(data)
			.join('stop')
			.attr('offset', (d, i, arr) => i / arr.length)
			.attr('stop-color', d => color(d.close));


		const xAxis = graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xTicks)

		graph.append('g')
			.call(d3.axisLeft(y).ticks(height / 40))
			.call(g => g.select('.domain').remove())
			.call(g => g.selectAll('.tick line').clone().attr('x2', width).attr('stroke-opacity', .15))

		const labels = graph.append('g').attr('id', 'labels')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', -margin.right)
			.attr('dx', '-1em')
			.attr('y', '-1em')
			.attr('text-anchor', 'start')
			.text('close')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', width - margin.right)
			.attr('y', height)
			.attr('dx', '-1em')
			.attr('dy', '2.2em')
			.attr('text-anchor', 'end')
			.text('date')



		const line = graph.append('g')
			.attr('clip-path', 'url(#line-clip)')

		line
			.call(g => g.append('path')
				.attr('class', 'brush-missingline')
				.attr('stroke', '#ccc')
				.attr('stroke-width', 1)
				.attr('fill', 'none')
				.attr('d', lineGen(data.filter(d => !isNaN(d.close)))))
			.call(g => g.append('path')
				.attr('class', 'brush-line')
				.attr('stroke', 'lightseagreen')
				.attr('stroke-width', 1)
				.attr('fill', 'none')
				.attr('d', lineGen(data)))

		line.append('g').attr('class', 'brush').call(brush)

		let timeout;

		function brushed(event) {
			const extent = event.selection;
			if (!extent) {
				if (!timeout) return timeout = setTimeout(function() {
					timeout = null;
				}, 350)
				x.domain(d3.extent(data, d => d.date))
				xAxis.transition().call(xTicks)
			} else {
				x.domain([x.invert(extent[0]), x.invert(extent[1])])
				line.select('.brush').call(brush.move, null)
			}
			xAxis.transition().call(xTicks)
			line.select('.brush-missingline').transition().attr('d', lineGen(data))
			line.select('.brush-line').transition().attr('d', lineGen(data.filter(d => !isNaN(d.close))))
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