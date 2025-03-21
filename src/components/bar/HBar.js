import * as d3 from "npm:d3";

export function HorizontalBar(input, id = "hbar") {
  let height = 400;
  let width = 500;
  const margin = {
    bottom: 50,
    top: 20,
    right: 50,
    left: 50,
  };
  const container = d3
    .create("div")
    .style("position", "relative")
    .style("width", width + margin.right + margin.left + "px")
    .style("height", "fit-content");

  let data = d3.sort(input, (d) => d.frequency);

  // Color
  let inter = d3.interpolate("#FF4E50", "#F9D423");

  let color2 = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.frequency))
    .range(["#F9D423", "#FF4E50"]);
  // Color End

  function chart() {
    container.style("width", width + margin.right + margin.left + "px");
    // Main chart
    let graph = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const clip = graph.append("g");
    clip
      .append("clipPath")
      .attr("id", `${id}-barclip`)
      .append("rect")
      .attr("x", -17)
      .attr("y", 0)
      .attr("width", width + 17)
      .attr("height", height);

    // x axis
    let x = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, d3.max(data, (d) => d.frequency)]);

    graph
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(height / 40)
          .tickSizeOuter(0)
          .ticks(width / 40),
      );
    // x axis End

    // y axis
    let y = d3
      .scaleBand()
      .range([height, 0])
      .domain(d3.map(data, (d) => d.letter))
      .padding(0.1);

    const yTicks = d3
      .axisLeft(y)
      .tickSizeOuter(0)
      .ticks(height / 40);

    const g = graph.append("g").attr("clip-path", `url(#${id}-barclip)`);
    const yAxis = g.append("g").attr("id", "y-axis").call(yTicks);
    // y axis End

    // Bars
    const bars = g
      .append("g")
      .attr("id", "bars")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("class", `${id}-bar`)
      .attr("x", (d) => x(0))
      .attr("y", (d) => y(d.letter))
      .attr("width", (d) => x(d.frequency))
      .attr("height", y.bandwidth)
      .attr("fill", (d) => color2(d.frequency));

    const textFormat = x.tickFormat(20, "%");
    const labels = g
      .append("g")
      .attr("font-size", "10px")
      .attr("fill", "#3f3f3f")
      .selectAll()
      .data(data)
      .join("text")
      .attr("text-anchor", "end")
      .attr("class", `${id}-label`)
      .attr("x", (d) => x(d.frequency))
      .attr("y", (d) => y(d.letter) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("dx", "-4")
      .text((d) => textFormat(d.frequency))
      .call((t) =>
        t
          .filter((d) => x(d.frequency) - x(0) < 22)
          .attr("dx", 4)
          .attr("text-anchor", "start"),
      );

    bars
      .on("mouseover", function (e, d) {
        d3.selectAll(`.${id}-bar`).attr("fill-opacity", 0.4);
        d3.select(this).attr("fill-opacity", 0.9);
      })
      .on("mouseleave", function (e, d) {
        d3.selectAll(`.${id}-bar`).attr("fill-opacity", 0.9);
      });
    // Bars end
    graph.call(zoom);
    // Labels
    graph
      .append("text")
      .attr("x", -width / 2)
      .attr("dy", "-2.2em")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "15px")
      .text("Letters");

    graph
      .append("text")
      .attr("x", width / 2.2)
      .attr("y", height)
      .attr("dy", "2em")
      .attr("font-size", "15px")
      .text("Frequency");
    // Labels end
    // Main chart End

    function zoom(graph) {
      let extent = [
        [margin.top, margin.right],
        [width - margin.right, height - margin.top],
      ];
      const z = d3
        .zoom()
        .scaleExtent([1, 6])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed);

      graph.call(z);

      function zoomed(event) {
        y.range([height, 0].map((d) => event.transform.applyY(d)));
        g.selectAll(`.${id}-bar`)
          .attr("y", (d) => y(d.letter))
          .attr("height", y.bandwidth());
        g.selectAll(`.${id}-label`).attr("y", (d) => y(d.letter));
        graph.select("#y-axis").call(yTicks);
        labels
          .attr("x", (d) => x(d.frequency))
          .attr("y", (d) => y(d.letter) + y.bandwidth() / 2)
          .call((t) =>
            t
              .filter((d) => x(d.frequency) - x(0) < 22)
              .attr("dx", 4)
              .attr("text-anchor", "start"),
          );
      }
    }
    // subChart()
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
