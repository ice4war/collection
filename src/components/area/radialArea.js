import * as d3 from "npm:d3";

export function radialArea(input, id = "radialArea") {
  let width = 700;
  let height = width;
  const margin = {
    bottom: 50,
    top: 40,
    right: 20,
    left: 20,
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
      .attr("transform", `translate(${margin.left + width/2},${margin.top+ height/2})`);
    // const formatMonth = d3.utcFormat("%B")
    // const data = input.map(d => {
    //   return {
    //     min: d.TMIN,
    //     max: d.TMAX,
    //     avg: d.TAVG,
    //     date: d.DATE,
    //     day: d.DATE.getUTCDate(),
    //     month: d.DATE.getUTCMonth(),
    //     year: d.DATE.getUTCFullYear()
    //   }
    // })

    // const groups = d3.groups(data, d => d.month)
    //   .sort(([a], [b]) => d3.ascending(a, b))

    const innerRadius = width / 5;
    const outerRadius = width / 2;

    const data = d3.groups(
        input,
        ({
          DATE
        }) => new Date(Date.UTC(2000, DATE.getUTCMonth(), DATE.getUTCDate())), // group by day of year
      ).sort(([a], [b]) => d3.ascending(a, b))
      .map(([date, v]) => ({
        date,
        avg: d3.mean(v, d => d.TAVG),
        min: d3.mean(v, d => d.TMIN),
        max: d3.mean(v, d => d.TMAX),
        minimum: d3.min(v, d => d.TMIN),
        maximum: d3.max(v, d => d.TMAX)
      }))

    const x = d3.scaleUtc()
      .domain([new Date('2000-01-01'), new Date('2001-01-01') - 1])
      .range([0, 2 * Math.PI])

    const y = d3.scaleRadial()
      .domain([d3.min(data, d => d.minimum), d3.max(data, d => d.maximum)])
      .range([innerRadius, outerRadius])

    const line = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .angle(d => x(d.date))

    const area = d3.areaRadial()
      .curve(d3.curveLinearClosed)
      .angle(d => x(d.date))

    const gp = graph.append('g')
      .datum(data)

    gp.append('path')
      .attr('fill', 'steelblue')
      .attr('fill-opacity', .2)
      .attr('d', area.innerRadius(d => y(d.minimum))
        .outerRadius(d => y(d.maximum))
      )
    gp.append('path')
      .attr('fill', 'steelblue')
      .attr('fill-opacity', .5)
      .attr('d', area
        .innerRadius(d => y(d.min))
        .outerRadius(d => y(d.max))
      )
    gp.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line.radius(d => y(d.avg)))

    graph.append('g')
      .attr('id', 'x-axis')
      .selectAll()
      .data(x.ticks())
      .join('g')
      .each((d, i) => d.id = i)
      .call(g => g.append('path')
        .attr('stroke', '#000')
        .attr('stroke-opacity', .4)
        .attr('d', d => `
          M${d3.pointRadial(x(d),innerRadius)}
          L${d3.pointRadial(x(d), outerRadius)}
        `))
      .call(g => g.append('path')
        .attr('id', d => d.id)
        .datum(d => [d, d3.utcMonth.offset(d)])
        .attr('fill', 'none')
        .attr('d', ([a, b]) => `
          M${d3.pointRadial(x(a),innerRadius)}
          A${innerRadius},${innerRadius} 0,0,1 ${d3.pointRadial(x(b),innerRadius)}
        `))
      .call(g => g.append('text')
        .append('textPath')
        .attr('startOffset', 6)
        .attr('xlink:href', d => '#' + d.id)
        .text(d3.utcFormat("%B")))


    graph.append('g')
      .attr('id', 'y-axis')
      .attr('text-anchor', 'middle')
      .selectAll()
      .data(y.ticks())
      .join('g')
      .call(g => g.append('circle')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-opacity', .5)
        .attr('r', y))
      .call(g => g.append('text')
        .attr('stroke', '#dedede')
        .attr('stroke-width', 5)
        .attr('paint-order', 'stroke')
        .attr('y', d => -y(d))
        .attr('dy','.3em')
        .text(d => d)
        .clone(true)
        .attr('y', (d) => y(d)))

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