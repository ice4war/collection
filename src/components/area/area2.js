import * as d3 from 'npm:d3';

export function area2Chart(data, id = 'area2') {
	let width = 700;
	let height = width * .6;
	const margin = {
		"bottom": 50,
		"top": 40,
		"right": 20,
		"left": 50
	};

	const container = d3.create('div')
		.style('position', 'relative')
		.style('height', height + margin.top + margin.bottom + 'px')
		.style('width', width + margin.right + margin.left + 'px');

	const tooltip = container.append('div')
		.attr('id', 'tooltip')
		.style('opacity', 0)

	let color = d3.scaleLinear()
		.domain(d3.extent(data, d => d.close))
		.range(['#FF4E50', '#F9D423']);


	function chart() {
		container.style('height', height + margin.top + margin.bottom + 'px')
			.style('width', width + margin.right + margin.left + 'px');

		const graph = container.append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleUtc().domain(d3.extent(data, d => d.date)).range([0, width]);
		const y = d3.scaleLinear().domain([0, d3.max(data, d => d.close)]).range([height, 0]);
		const format = d3.utcFormat('%Y-%m-%d')
		graph.append('linearGradient').attr('id', id)
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('y2', 0)
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y1', '100%')
			.selectAll('stop')
			.data(data)
			.join('stop')
			.attr('offset', (d, i, arr) => i / arr.length)
			.attr('stop-color', d => color(d.close));
		const xAxis = d3.axisBottom(x).tickSizeOuter(0).ticks(width / 40);

		graph.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
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
			.text('Close')
		labels.append('text')
			.attr('font-size', '12px')
			.attr('x', width - margin.right)
			.attr('y', height)
			.attr('dx', '-1em')
			.attr('dy', '2.2em')
			.attr('text-anchor', 'end')
			.text('Date')


		const area = d3.area()
			.x(d => x(d.date)).y0(d => y(0)).y1(d => y(d.close));
		//Area
		graph.append('g')
			.append('path')
			.datum(data)
			.attr('stroke', 'coral')
			.attr('stroke-width', 2)
			.attr('fill', `url(#${id})`)
			.attr('fill-opacity', .7)
			.attr('d', area);
		//Dots
		const dots = graph.append('g')
			.selectAll('.annot-circle')
			.data(data)
			.join('circle')
			.attr('cx', d => x(d.date))
			.attr('cy', d => y(d.close))
			.attr('fill', 'transparent')
			.attr('fill-opacity', .8)
			.attr('stroke', 'none')
			.attr('r', 2)
			.on('pointerenter', function(event, d) {
				dots.attr('fill-opacity', .2)
				dots.filter(e => e.date === d.date)
					.attr('fill-opacity', 1)
					.attr('fill', d => color(d.close))
					.attr('r', 5)

				tooltip.style('top', y(d.close) + 20 + 'px')
					.style('left', x(d.date) + 10 + 'px')
					.style('border-color', color(d.close))
				tooltip.style('opacity', 1).html(`<span>Date: ${format(d.date)}</span><br><span>Value: ${d.close}</span>`)
			})
			.on('pointerleave', function(event, d) {
				dots.transition().attr('fill', 'transparent').attr('r', 2)
				tooltip.transition().style('opacity', 0)
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