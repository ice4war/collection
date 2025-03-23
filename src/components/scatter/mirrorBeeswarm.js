import * as d3 from "npm:d3";

export function mirrorBeeswarm(input, id = "mirror-beeswarm") {
  let width = 700;
  let height = 400;
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

  const k = "0-60 mph (s)";
  const radius = 3;
  const padding = 1.5;
  const keys = input.columns.slice(1).map((d, i) => ({
    name: d,
    index: i
  }));

  const color = d3
    .scaleOrdinal(d3.quantize(d3.interpolateSpectral, keys.length))
    .domain(keys);

  function chart() {
    container.style("width", width + margin.right + margin.left + "px");

    const graph = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // const reg = d => d.name.split(/[\s[0-9]]/).join('')
    // const g = graph
    //   .selectAll("g")
    //   .data(keys)
    //   .join("g")
    //   .attr('id', reg)
    //   .attr("transform", (d) => `translate(0,${d.index * 500})`);

    // g.each((d, i) =>
    //   update(
    //     radius,
    //     d.name,
    //     d.index,
    //     d3.select(`#${reg(d)}`),
    //     color(d.name),
    //   ),
    // );
    const g = graph.append('g')
    update(radius, keys[2].name, 2, g, color(keys[2].name))

    function update(cradius, key, space, g, fillValue) {
      const x = d3
        .scaleLinear()
        .domain(d3.extent(input, (d) => d[key]))
        .range([0, width]);
      g.append("g")
        .attr("transform", `translate(0,${height/2})`)
        .call(d3.axisBottom(x));
      const nodes = dodge(input, {
        radius: cradius * space + padding,
        x: (d) => x(d[key]),
      })

      let radiusKey = 'power (hp)';

      const calcRadius = d3.scalePow()
        .domain(d3.extent(nodes, (d) => d.data[radiusKey]))
        .range([1, 4])
        .exponent(1)

      g.append("g")
        .attr("transform", `translate(0,-${height/2})`)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("fill", fillValue)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => height - padding - cradius - d.y)
        .attr("r", d => calcRadius(d.data[radiusKey]));
    }

    function dodge(data, {
      radius,
      x
    }) {
      const radius2 = radius ** 2;
      const circles = data.map(d => ({
        x: x(d),
        data: d
      })).sort((a, b) => a.x - b.x);
      const epsilon = 1e-3;
      let head = null,
        tail = null;

      // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
      function intersects(x, y) {
        let a = head;
        while (a) {
          if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
            return true;
          }
          a = a.next;
        }
        return false;
      }

      // Place each circle sequentially.
      for (const b of circles) {

        // Remove circles from the queue that can’t intersect the new circle b.
        while (head && head.x < b.x - radius2) head = head.next;

        // Choose the minimum non-intersecting tangent.
        if (intersects(b.x, b.y = 0)) {
          let a = head;
          b.y = Infinity;
          do {
            let y1 = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
            let y2 = a.y - Math.sqrt(radius2 - (a.x - b.x) ** 2);
            if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1;
            if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2;
            a = a.next;
          } while (a);
        }

        // Add b to the queue.
        b.next = null;
        if (head === null) head = tail = b;
        else tail = tail.next = b;
      }

      return circles;
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