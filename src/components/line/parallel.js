import * as d3 from 'npm:d3';
export function parallelChart(input, id = "parallelchart") {
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

		const headers = data.columns.slice(1);

		const y = d3.scalePoint()
			.range([height, 0])
			.domain(headers)
			.padding(.5);


		const x = new Map(Array.from(headers, h => [h, d3.scaleLinear()
			.range([0, width])
			.domain(d3.extent(data, d => d[h]))
		]))

		const k = headers[1];

		const color = d3.scaleSequential()
			.domain(x.get(k).domain())
			.interpolator(d3.interpolatePurples)

		const line = d3.line()
			.defined(([, value]) => value != null)
			.x(([key, value]) => x.get(key)(value))
			.y(([key]) => y(key))

		const path = graph.append('g')
			.attr('fill', 'none')
			.attr('stroke-width', 1.2)
			.selectAll('path')
			.data(data.slice().sort((a, b) => d3.ascending(a[k], b[k])))
			.join('path')
			.attr('stroke', d => color(d[k]))
			.attr('d', (d) => line(d3.cross(headers, [d], (key, d) => [key, d[key]])))
			.style('mix-blend-mode', null)


		graph.append('g')
			.selectAll('g')
			.data(headers)
			.join('g')
			.attr('transform', (d) => `translate(0,${y(d)})`)
			.each((d) => d3.select(this).call(d3.axisLeft(x.get(d))))
			.call(g => g.append('text')
				.attr('x', 0)
				.attr('y', -6)
				.attr('text-anchor', 'start')
				.text(d => d))
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