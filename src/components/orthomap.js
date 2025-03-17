import * as d3 from 'npm:d3';


export function Globe(data) {
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

		const graph = container.append('canvas')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)

		const ctx = graph.node().getContext('2d')
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