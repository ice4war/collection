---
title: Radial Chart
theme: dashboard
---

```js
// Files
const population = FileAttachment('../data/radial/population-by-age.csv').csv({"typed":true});
```
```js
// Imports
import {pieChart} from "../components/radial/piechart.js";
import {pieLine} from "../components/radial/pieline.js";
import {donutLine} from "../components/radial/donutline.js";
import {donutChart} from "../components/radial/donut.js";
import {donutAdjust} from "../components/radial/donut2.js";
```
<div class='radialCharts'>
  <div class="card">${pieChart(population).size([500,400])()}</div>
  <div class="card">${pieLine(population).size([500,400])()}</div>
  <div class="card">${donutChart(population).size([500,400])()}</div>
  <div class="card">${donutAdjust(population).size([500,400])()}</div>
  <div class="card">${donutLine(population).size([600,600])()}</div>
</div>

<style>
		.radialCharts{
			font-family: sans-serif;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
		}
		.card{
			margin-right: 1em;
			height: fit-content;
		}

</style>
