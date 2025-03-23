import * as d3 from "npm:d3";

export function bubbleChart(input, id = "bubble") {
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

    const graph = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const pack = d3.pack().size([width, height]).padding(5);

    const root = pack(
      d3
        .hierarchy({
          children: input,
        })
        .sum((d) => d.value),
    );
    const node = graph
      .append("g")
      .selectAll()
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    const group = (g) => g.id.split(".")[1];

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("stroke", (d) => color(group(d.data)))
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.8)
      .attr("fill", (d) => color(group(d.data)))
      .attr("fill-opacity", 0.5)
      .call((g) => g.append("text").text((d) => d.data.id));

    return container.node();
  }

  chart.size = function ([w, h]) {
    if (!arguments.length) return width;
    width = w;
    height = h;
    return chart;
  };

  return chart;
}
