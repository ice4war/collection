import * as d3 from 'npm:d3';

export function Barchart(input, id = "bar") {
	let width = 400;
	let height = 400;
	const margin = {
		"bottom": 50,
		"top": 20,
		"right": 20,
		"left": 50
	};
	const container = d3.create('div')
		.style('position', 'relative')
		.style('width', width + margin.right + margin.left + 'px')
		.style('height', 'fit-content');


	const tooltip = container.append('div')
		.attr('style', `position: absolute;
			opacity:0;
			top:0;
			right:0;
			padding: .2em;
			border: 1px solid #888;`)

	let data = d3.sort(input, d => d.frequency).reverse()
	// Color
	let inter = d3.interpolate('#FF4E50', '#F9D423');

	let color1 = d3.scaleOrdinal()
		.domain(data.map(d => d.letter))
		.range(d3.quantize(inter, data.length + 1))

	let color2 = d3.scaleLinear()
		.domain(d3.extent(data, d => d.frequency))
		.range(['#F9D423', '#FF4E50']);
	// Color End



	function chart() {
		container.style('width', width + margin.right + margin.left + 'px');

		// Main chart
		let graph = container.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append('g')
			.attr('overflow', 'hidden')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.call(zoom);

		const clip = graph.append('g')
		clip.append('clipPath')
			.attr('id', `${id}-barclip`)
			.append('rect')
			.attr('x', 2)
			.attr('y', margin.top)
			.attr('width', width)
			.attr('height', height)

		// Y axis 
		let y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(data, d => d.frequency)]);

		graph.append('g')
			.attr('id', 'y-axis')
			.call(d3.axisLeft(y).ticks(height / 40))
		// Y axis End

		// X axis
		let x = d3.scaleBand()
			.range([0, width])
			.domain(d3.map(data, d => d.letter))
			.padding(.1);

		const barGroup = graph.append('g')
			.attr('clip-path', `url(#${id}-barclip)`);

		const xAxis = barGroup.append('g')
			.attr('id', 'x-axis')
			.attr('transform', "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickSizeOuter(0));
		// Xaxis End

		// Bars 
		const bars = barGroup.append('g')
			.selectAll('.bar')
			.data(data)
			.join('rect')
			.attr('class', `${id}-bar`)
			.attr('x', d => x(d.letter))
			.attr('y', d => y(d.frequency))
			.attr('width', x.bandwidth())
			.attr('height', d => height - y(d.frequency))
			.attr('fill-opacity', .9)
			.attr('fill', d => color2(d.frequency));

		bars.on('mouseover', function(e, d) {
				tooltip.transition().duration(100)
					.style('z-index', 2)
					.style('opacity', 1);
				tooltip.html(`<span>${d.letter}</span><br><span>${d.frequency}</span>`);
				d3.selectAll(`.${id}-bar`).attr('fill-opacity', .4);
				d3.select(this).attr('fill-opacity', .9)
			})
			.on('mouseleave', function(e, d) {
				tooltip.transition().duration(100).style('opacity', 0);
				d3.selectAll(`.${id}-bar`).attr('fill-opacity', .9)
			});
		// Bars end 

		// Labels
		graph.append('text')
			.attr('x', -width / 3)
			.attr('dy', '-2.2em')
			.attr('transform', 'rotate(-90)')
			.attr('font-size', '15px')
			.text('Frequency Hz')

		graph.append('text')
			.attr('x', width / 2.2)
			.attr('y', height)
			.attr('dy', '2em')
			.attr('font-size', '15px')
			.text('Letters')
		// Labels end 

		// Main chart End

		function zoom(graph) {
			let extent = [
				[margin.left, margin.top],
				[width - margin.right, height - margin.top]
			];
			const z = d3.zoom()
				.scaleExtent([1, 6])
				.translateExtent(extent)
				.extent(extent)
				.on('zoom', zoomed);

			graph.call(z)


			function zoomed(event) {
				x.range([0, width].map(d => event.transform.applyX(d)));
				graph.selectAll(`.${id}-bar`).attr('x', d => x(d.letter)).attr('width', x.bandwidth())
				xAxis.transition().call(d3.axisBottom(x).tickSizeOuter(0))
			}
		}
		// subChart()
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