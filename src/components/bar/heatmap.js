import * as d3 from 'npm:d3';

export function heatmap(input, id = "heatmap") {
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
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('style', `font-size: 10px; font-family: sans;`)

		const cellSize = 13;
		const cellH = cellSize * 7;
		const data = d3.pairs(input, ({
			Close: Previous
		}, {
			Date,
			Close
		}) => ({
			date: Date,
			value: (Close - Previous) / Previous,
			close: Close
		}))
		const yearGroup = d3.groups(data, d => d.date.getFullYear()).reverse()
		const max = d3.quantile(data, .995, d => Math.abs(d.value))
		const color = d3.scaleSequential(d3.interpolatePiYG).domain([-max, max])

		const timeWeek = d3.utcMonday;
		const countDay = i => (i + 6) % 7;


		const year = graph.selectAll('g')
			.data(yearGroup)
			.join('g')
			.attr('transform', (d, i) => `translate(20,${ cellH * i + cellSize})`)

		year.append('text')
			.attr('x', -5)
			.attr('x', -5)
			.attr('text-anchor', 'end')
			.text(([d]) => d)

		year.append('g')
			.attr('id', 'weekday')
			.attr('text-anchor', 'end')
			.selectAll()
			.data(d3.range(1, 6))
			.join('text')
			.attr('x', -5)
			.attr('dy', '.5em')
			.attr('y', i => (countDay(i) + .5) * cellSize)
			.text(i => "SMTWTFS" [i])

		year.append('g')
			.selectAll()
			.data(([, val]) => val.filter(d => ![0, 6].includes(d.date.getUTCDate())))
			.join('rect')
			.attr('rx', 2)
			.attr('ry', 2)
			.attr('x', d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize * .9)
			.attr('y', d => countDay(d.date.getUTCDay()) * cellSize + .5)
			.attr('width', cellSize - 2)
			.attr('height', cellSize - 2)
			.attr('fill', d => color(d.value))

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