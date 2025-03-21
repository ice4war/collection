import * as d3 from "npm:d3";

export function ridgeLine(input, id = "ridgeline") {
  let width = 700;
  let height = width * 0.6;
  const margin = {
    bottom: 50,
    top: 40,
    right: 20,
    left: 120,
  };

  const container = d3
    .create("div")
    .style("position", "relative")
    .style("height", height + margin.top + margin.bottom + "px")
    .style("width", width + margin.right + margin.left + "px");

  function chart() {
    container
      .style("height", height + margin.top + margin.bottom + "px")
      .style("width", width + margin.right + margin.left + "px");

    const graph = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const dates = Array.from(d3.group(input, (d) => +d.date).keys()).sort(
      d3.descending,
    );
    const series = d3
      .groups(input, (d) => d.name)
      .map(([name, values]) => {
        const value = new Map(values.map((d) => [+d.date, d.value]));
        return {
          name,
          values: dates.map((d) => value.get(d)),
        };
      });
    const x = d3.scaleTime().domain(d3.extent(dates)).range([0, width]);

    const y = d3
      .scalePoint()
      .domain(series.map((d) => d.name))
      .range([0, height]);

    const z = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d.values))])
      .nice()
      .range([0, -(Math.floor(height / 100 / 2) - 1) * y.step()]);

    const color = d3.scaleLinear().domain(z.domain()).range(["red", "blue"]);

    graph
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    graph.append("g").call(d3.axisLeft(y));

    const area = d3
      .area()
      .curve(d3.curveBasis)
      .x((d, i) => x(dates[i]))
      .y0(0)
      .defined((d) => !isNaN(d))
      .y1((d) => z(d));

    const g = graph
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("transform", (d) => `translate(0,${y(d.name) + 1})`)
      .style("mix-blend-mode", "multiply	");

    g.append("path")
      .attr("fill", "#ddd")
      .attr("stroke", "none")
      .attr("d", (d) => area(d.values));

    g.append("path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("d", (d) => area.lineY1()(d.values));
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
