import * as d3 from 'npm:d3';

export function scatterChart(data) {
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
		.style('height', 'fit-content')

	const tooltip = container.append('div')
		.attr('style', `position: absolute;
			opacity:0;
			top:0;
			right:0;
			padding: .2em;
			border: 1px solid #888;`);

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

		const x = d3.scaleLinear().domain(d3.extent(data, d => d.mpg)).range([0, width]).nice()
		const y = d3.scaleLinear().domain(d3.extent(data, d => d.hp)).range([height, 0])

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
		lgx.append('text').attr('class','x-legend')
		const lgy = graph.append('g')
		lgy.append('text').attr('class','y-legend')
		const xl = lgx.append('line').attr('y1',height)
		const yl = lgy.append('line').attr('x1',0)

		graph.append('g')
			.selectAll()
			.data(data)
			.enter().append('circle')
			.attr('cx', d => x(d.mpg))
			.attr('cy', d => y(d.hp))
			.attr('fill', 'coral')
			.attr('r', 4)
			.on('mouseover', function(event, d) {
				d3.select(this).attr('stroke', 'seagreen')
					.attr('stroke-opacity', .3)
					.attr('stroke-width', 10);
					const xpos = x(d.mpg)
					const ypos = y(d.hp)
					xl.attr('x1',xpos).attr('x2',xpos)
						.attr('y2',ypos)
						.attr('stroke','coral')
					yl.attr('x2',xpos).attr('y2',ypos)
						.attr('y1',ypos)
						.attr('stroke','coral')
					lgx.select('.x-legend')
						.attr('text-anchor','start')
						.attr('x',xpos+2)
						.attr('y',height)
						.attr('fill','coral')
						.text(d.mpg)

					lgy.select('.y-legend')
						.attr('text-anchor','start')
						.attr('x',0)
						.attr('y',ypos-2)
						.attr('fill','coral')
						.text(d.hp)
			})
			.on('mouseleave', function(event, d) {
				d3.select(this).attr('stroke', 'none');
				xl.attr('stroke','none')
				yl.attr('stroke','none')
				lgy.select('.y-legend').text('')
				lgx.select('.x-legend').text('')

			})

		return container.node();
	}

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		height = width * .6;
		return chart;
	}

	return chart;
}