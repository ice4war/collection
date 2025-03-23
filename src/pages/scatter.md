---
title: Scatter Chart
theme: dashboard
---

```js
// Files
const mtcars = FileAttachment('../data/scatter/mtcars.csv').csv({"typed":true});
const bubble = FileAttachment('../data/scatter/bubble.csv').csv({"typed":true});
const cars = FileAttachment('../data/scatter/cars.csv').csv({"typed":true});
const population = FileAttachment('../data/scatter/us-population-state-age.csv').csv({"typed":true});
```
```js
// Imports
import {scatterChart} from '../components/scatter/scatter.js';
import {scatterShape} from '../components/scatter/scatterShape.js';
import {dotPlot} from '../components/scatter/dot.js';
import {beeswarm} from '../components/scatter/beeswarm.js';
import {mirrorBeeswarm} from '../components/scatter/mirrorBeeswarm.js';
import {bubbleChart} from '../components/scatter/bubble.js';
```
<div class='scattercharts'>
  <div class="card">${scatterChart(mtcars)()}</div>
  <div class="card">${scatterShape(mtcars).size([700,400])()}</div>
  <div class="card">${dotPlot(population).size([700,700])()}</div>
  <div class="card">${beeswarm(cars)()}</div>
  <div class="card">${mirrorBeeswarm(cars)()}</div>
  <div class="card">${bubbleChart(bubble)()}</div>
</div>

<style>
		.scattercharts{
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
