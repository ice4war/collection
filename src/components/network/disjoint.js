import * as d3 from "npm:d3";

export function disjointGraph(input, id = "dgraph") {
  let width = 700;
  let height = width;
  const margin = {
    bottom: 50,
    top: 40,
    right: 20,
    left: 50,
  };

  const container = d3
    .create("div")
    .style("position", "relative")
    .style("height", "fit-content");

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  function chart() {
    container.style("width", width + margin.right + margin.left + "px");

    const links = input.links.map(d => ({
      ...d
    }))
    const nodes = input.nodes.map(d => ({
      ...d
    }))
    const graph = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .attr("style", "font-size:10px;")
      .append("g")
      .attr("transform", `translate(${margin.left+width/2},${margin.top+height/2})`);

    const defs = graph.append('defs')
    defs.append('marker')
      .attr('id', 'arrow')
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append('path')
      .attr('fill', '#ccc')
      .attr('d', 'M0,-5 L10,0 L0,5')

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', ticked)

    const link = graph.append('g')
      .attr('stroke', '#ccc')
      .selectAll()
      .data(links)
      .join('line')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', d => Math.sqrt(d.value))
      .attr('marker-end', 'url(#arrow)')

    const cr = 3;
    const node = graph.append('g')
      .attr('stroke-width', cr / 2)
      .selectAll()
      .data(nodes)
      .join('circle')
      .attr('fill', d => d.radius ? color(d.group) : 'none')
      .attr('stroke', d => color(d.group))
      .attr('r', d => d.radius ? d.radius : cr)
      .on('pointerenter', function(event, d) {
        d3.select(this).attr('fill', color(d.group))
          .attr('r', d => d.radius ? d.radius + 1 : cr + 2)
      })
      .on('pointerleave', function(event, d) {
        d3.select(this).attr('r', d => d.radius ? d.radius : cr)
          .attr('fill', d => d.radius ? color(d.group) : 'none')

      })

    let drag = (simulation) => {
      function dragStarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      function dragged(event, d) {

        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      return d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragended);
    }

    node.call(drag(simulation))

    function ticked() {
      link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }


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