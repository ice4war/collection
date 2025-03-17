---
title: Line Chart
theme: dashboard
---


```js
const aapl = FileAttachment('../data/line/aapl.csv').csv({"typed":true})
const bitcoin = FileAttachment('../data/line/bitcoin.csv').csv({"typed":true})
const multi = FileAttachment('../data/line/bls-metro-unemployment.csv').csv({"typed":true})
const gdp = FileAttachment('../data/line/government-receipts-of-gdp.csv').csv({"typed":true})
const cancer = FileAttachment('../data/line/cancer.csv').csv({"typed":true});
const schedule = FileAttachment('../data/line/schedule.tsv').tsv({"typed":true});

```


```js
import {lineChart} from '../components/line/line.js';
import {multiLine} from '../components/line/multiline.js';
import {slopeLine} from '../components/line/slope.js';
import {candleChart} from '../components/line/candle.js';
// const inter = d3.interpolateRgbBasis([ '#615043','#987155', '#B89675', '#69879A', '#3C92A8'])
```
# Line Charts

[Back to Home](/)
<div class="linecharts">
<div class="card">
	<p>Brushable Line</p>
		${lineChart(aapl)()}
	</div> 
	<div class="card">
		<p>Multi Line with hover effect</p>
		${multiLine(multi)()}
	</div>
	<div class="card">
		<p>Slope chart highlights on hover</p>
		${slopeLine(cancer).size([700,950])()}
	</div>
	<div class="card">
		<p>Candle stick for Stock volume</p>
		${candleChart(bitcoin).size([700,400])()}
	</div>
</div>

<style>
		.linecharts{
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