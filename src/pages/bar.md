---

title: Bar Chart
toc: false
theme: dashboard
---

```js
import * as d3 from 'npm:d3'; 
import {Barchart} from '../components/bar/Bar.js';
import {HorizontalBar} from '../components/bar/HBar.js';
import {DivergeBar} from '../components/bar/diverge.js';
import {StackBar} from '../components/bar/stack.js';
import {StackHBar} from '../components/bar/stackH.js';
import {normalizedStackHBar} from '../components/bar/noramlizedBar.js';
import {GroupedBar} from '../components/bar/groupedBar.js';
import {GroupedBarH} from '../components/bar/groupedBarH.js';
import {Timeline} from '../components/bar/timeline.js';
import {heatmap} from '../components/bar/heatmap.js';
import {radialBar} from '../components/bar/radialBar.js';

```

```js

const bardata = FileAttachment('../data/bar/alphabet.csv').csv({"typed":true});
const diverge = FileAttachment('../data/bar/state-population-2010-2019.tsv').tsv({"typed":true});
let stack = FileAttachment('../data/bar/us-population-state-age.csv').csv({"typed":true});
let timeline = FileAttachment('../data/bar/timeline.csv').csv({"typed":true});
let date = FileAttachment('../data/bar/date.csv').csv({"typed":true});

```

```js
const stackData = stack.columns.slice(1).flatMap(age=>stack.map(d=>({state:d.name,age,population:d[age]})))
```

# Bar charts
[Back to Home](/)



<div class="barcharts">
	<div class='card'>
		<p>World Timeline</p>
		${Timeline(timeline).size([600, 800])()}
	</div>
	<div class='card'>
		<p>Radial</p>
		${radialBar(bardata).size([700, 700])()}
	</div>
	<div class='card'>
	<p>Vertically oriented</p>
		${Barchart(bardata,"regular").size([800,300])()}
	</div>
		<div class='card'>
			<p>Horizontally oriented</p>
		${HorizontalBar(bardata,"horizontal").size([800,500])()}
	</div>
	<div class='card'>
		<p>Diverged</p>
		${DivergeBar(diverge,"diverge").size([800,800])()}
	</div>
	<div class='card'>
		<p>Vertically Stacked</p>
		${StackBar(stackData,"stack").size([800,400])()}
	</div>
	<div class='card'>
		<p>Horizoontally Stacked </p>
		${StackHBar(stackData,"stack").size([400, 600])()}
	</div>
	<div class='card'>
		<p>Normalized Horizontally</p>
		${normalizedStackHBar(stackData).size([400, 600])()}
	</div>
	<div class='card'>
		<p>Vertically Grouped </p>
		${GroupedBar(stackData).size([900, 500])()}
	</div>
	<div class='card'>
		<p>Horizontally Grouped</p>
		${GroupedBarH(stackData).size([500, 1500])()}
	</div> 
</div>

<style>
		.barcharts{
			font-family: sans-serif;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
		}
		.card{
			margin-right: 1em;
			height: fit-content;
		}
		svg{
			max-width: 100%;
		}
</style>