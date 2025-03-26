---
title: Netword Chart
theme: dashboard
---

```js
// Files
const miserables = FileAttachment('../data/network/miserables.json').json();
const energy = FileAttachment('../data/network/energy.csv').csv({"typed":true});
const graph = FileAttachment('../data/network/graph.json').json();

```
```js
// Imports
import {directedGraph} from '../components/network/dgraph.js'
import {disjointGraph} from '../components/network/disjoint.js'
import {arcGraph} from '../components/network/arc.js'
```
<div class='networkCharts'>
	<div class="card">${directedGraph(miserables).size([500, 500])()}</div>
	<div class="card">${disjointGraph(graph).size([700, 600])()}</div>
	<div class="card">${arcGraph(miserables).size([500, 900])()}</div>
</div>

<style>
		.networkCharts{
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
