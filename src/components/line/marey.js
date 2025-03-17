import * as d3 from 'npm:d3';

export function mareyChart(input, id = "mareyline") {
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



	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		const stations = input.columns.filter(e => /^stop\|/.test(e))
			.map(d => {
				const [, name, distance, zone] = d.split("|");
				return {
					key: d,
					name,
					distance: +distance,
					zone: +zone
				}
			})
		const data = input.map(d => ({
			number: d.number,
			type: d.type,
			direction: d.direction,
			stops: stations.map(s => ({
				s,
				time: parseTime(d[s.key])
			}))
		}))
		console.log(data)

		function parseTime(time) {
			const date = d3.utcParse("%I:%M%p")(time)
			if (date !== null && date.getUTCHours() < 3) date.setUTCDate(date.getUTCDate() + 1)
			return date
		}
		// console.log(data)

		// Main chart
		const graph = container.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('style', `font-size: 10px; font-family: sans-serif;`);

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