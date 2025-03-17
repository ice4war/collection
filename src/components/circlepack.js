import * as d3 from 'npm:d3';

export function circlePack(data) {
	let width = 700;
	let height = width;
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
			.attr('font-size', '10px')
			.append('g')
			.attr('transform', `translate(${margin.left},0)`);

		const root = tree(data);
		const node = graph.selectAll()
			.data(root.descendants())
			.join('g')
			.attr('transform', d => `translate(${d.x},${d.y})`)

		node.append('circle')
			.attr('fill', d => d.depth == 0 ? 'lightseagreen' : d.children ? '#333' : '#eee')
			.attr('fill-opacity', .7)
			.attr('stroke', d => d.depth == 0 ? 'none' : d.children ? '#333' : null)
			.attr('r', d => d.r)

		const text = node.filter(d => !d.children && d.r > 20)
			.append('text')
			.attr('clip-path', d => `circle(${d.r})`)

		text.selectAll()
			.data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
			.join('tspan')
			.attr('text-anchor','middle')
			.attr('x', 0)
			.attr('y', (d, i, nodes) => `${i-nodes.length/2 +.35}em`)
			.text(d => d)
		return container.node();
	}

	function tree(data) {
		const pack = d3.pack().size([width, height]).padding(2);
		return pack(d3.hierarchy(data)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value));
	}

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		height = width;
		return chart;
	}

	return chart;
}