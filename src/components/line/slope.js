import * as d3 from 'npm:d3';
export function slopeLine(input, id = "slopeline") {
	let width = 600;
	let height = 400;
	const margin = {
		"bottom": 20,
		"top": 40,
		"right": 20,
		"left": 40
	};

	const container = d3.create('div')
		.style('position', 'relative')
		.style('width', width + margin.right + margin.left + 'px');
	const data = input;


	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		// Main chart
		const graph = container.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('style', `font-size: 10px; font-family: sans-serif;`);

		const years = new Set(input.map(d => d.year))
		const x = d3.scalePoint()
			.range([0, width])
			.domain(years)
			.padding(.5);

		const y = d3.scaleLinear()
			.range([height, 0])
			.domain(d3.extent(data.map(d => d.survival)))

		const name = new Set(data.map(d => d.name))

		const colorPath = d3.scaleOrdinal(d3.quantize(d3.interpolateCool, name.size)).domain(name)

		const line = d3.line()
			.x(d => x(d.year))
			.y(d => y(d.survival))

		graph.append('g')
			.attr('id', 'x-axis')
			.attr('text-anchor', 'middle')
			.selectAll('g')
			.data(years)
			.join('g')
			.attr('transform', d => `translate(${x(d)},-10)`)
			.call(g => g.append('text').text(d => d))
			.call(g => g.append('line').attr('y2', 9).attr('y1', 3).attr('stroke', 'currentColor'))

		const path = graph.append('g')
			.attr('fill', 'none')
			.attr('stroke-opacity', .9)
			.selectAll('path')
			.data(d3.group(data, d => d.name))
			.join('path')
			.attr('id', ([n,]) => n)
			.attr('d', ([, values]) => line(values))
			.attr('stroke', ([name,]) => colorPath(name))
			.attr('mix-blend-mode', 'multiply')

		const labelGroup = graph.append('g')
			.selectAll('g')
			.data(d3.group(data, d => d.year))
			.join('g')

		labelGroup
			.attr('stroke', 'white')
			.attr('stroke-width', 4)
			.attr('paint-order', 'stroke')
			.attr('transform', ([year]) => `translate(${x(year) + (
				year === '5 Year' ? -7 : year === '20 Year' ? 7 : 0
			)},0)`)
			.attr('text-anchor', ([year]) => year === '5 Year' ? 'end' :
				year === '20 Year' ? 'start' : 'middle')

		const hoverlabels = labelGroup.selectAll('text')
			.data(([year, values]) => values)
			.join('text')
			.attr('id', (d, i) => i + '_' + d.name.slice(0, 4))
			.attr('y', (d) => y(d.survival))
			.attr('dy', '.35em')
			.text(d => d.year === '5 Year' ?
				`${d.name} ${d.survival}` :
				d.year === '20 Year' ? `${d.survival} ${d.name}` : `${d.survival}`)


		hoverlabels.on('mouseenter', function (event, d) {
			path.attr('stroke-opacity', .2)
			path.filter(([name,]) => name == d.name)
				.raise()
				.attr('stroke-width', 2)
				.attr('stroke-opacity', .9)
		}).on('mouseleave', function (event, d) {
			path.attr('stroke-opacity', .9).attr('stroke-width', 1)
		})

		return container.node();
	}
	chart.size = function ([w, h]) {
		if (!arguments.length) return width;
		width = w;
		height = h;
		return chart;
	}

	return chart;
}