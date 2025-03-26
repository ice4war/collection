import * as d3 from "npm:d3";

export function arcGraph(input, id = "arc-graph") {
  let width = 700;
  let height = width;
  const margin = {
    bottom: 50,
    top: 40,
    right: 20,
    left: 60,
  };

  const container = d3
    .create("div")
    .style("position", "relative")
    .style("height", "fit-content");


  function chart() {
    container.style("width", width + margin.right + margin.left + "px");

    const graph = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .attr("style", "font-size:10px;")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const nodes = input.nodes;
    const links = input.links;

    // const values
    const radius = 3;
    const defaultOpacity = .9;
    const hoverOpacity = .2;
    const ids = d3.groups(nodes, d => d.group).map(d => d[1]).flat()
    const y = d3.scalePoint()
      .domain(ids.map(d => d.id).sort())
      .range([0, height])

    const c = new Set(nodes.map(d => d.group))

    const color = d3.scaleOrdinal()
      .domain(c)
      .range(d3.quantize(d3.interpolateViridis, c.size))

    const Y = new Map(nodes.map(({
      id
    }) => [id, y(id)]))

    const groups = new Map(nodes.map(d => [d.id, d.group]))

    const path = graph.insert('g', '*')
      .attr('fill', 'none')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', defaultOpacity)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('id', ({
        target
      }) => target)
      .attr('stroke', ({
          source,
          target
        }) => groups.get(source) === groups.get(target) ?
        color(groups.get(source)) : '#777')
      .attr('d', function(d) {
        const y1 = Y.get(d.source)
        const y2 = Y.get(d.target)
        const r = Math.abs(y2 - y1) / 2;
        return `M${margin.left},${y1} A${r},${r},0,0,${y1 < y2?1:0} ,${margin.left},${y2}`
      })
      // .style('mix-blend-mode','multiply')

    const label = graph.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('fill-opacity', defaultOpacity)
      .attr('transform', d => `translate(${margin.left},${Y.get(d.id)})`)

    const text = label.append('text')
      .attr('text-anchor', 'end')
      .attr('x', -6)
      .attr('dy', '.35em')
      .text(d => d.id)

    const circle = label.append('circle')
      .attr('r', radius)
      .attr('fill', d => color(d.group))

    label.on('pointerenter', function(event, e) {
        text.attr('fill-opacity', hoverOpacity)
        text.filter(d => d.id === e.id).attr('fill-opacity', defaultOpacity)

        circle.attr('fill-opacity', hoverOpacity)
        circle.filter(d => d.id === e.id)
          .attr('fill-opacity', defaultOpacity)
          .attr('r', radius + 1)
        path.attr('stroke-opacity', hoverOpacity)
        path.filter(({
            source
          }) => source === e.id)
          .attr('stroke-opacity', defaultOpacity)
          .attr('stroke-width', 1.6).raise()

      })
      .on('pointerleave', function(event, e) {
        text.attr('fill-opacity', defaultOpacity)
        circle.attr('fill-opacity', defaultOpacity)
          .attr('r', radius)
        path.attr('stroke-opacity', defaultOpacity)
          .attr('stroke-width', 1)
      })

    return container.node();
  }

  chart.size = function([w, h]) {
    if (!arguments.length) return width;
    width = w;
    height = h;
    return chart;
  };

  return chart;
}