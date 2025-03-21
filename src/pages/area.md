---
title: Area Charts
theme: dashboard
---

```js
// Components
import { areaChart } from "../components/area/area.js";
import { area2Chart } from "../components/area/area2.js";
import { stackArea } from "../components/area/areastack.js";
import { stackNormal } from "../components/area/areanormal.js";
import { streamArea } from "../components/area/streamarea.js";
import { ridgeLine } from "../components/area/ridge.js";
import { radialArea } from "../components/area/radialArea.js";
```

```js
// Files
const aapl = FileAttachment("../data/line/aapl.csv").csv({ typed: true });
const stack1 = FileAttachment("../data/area/stack.csv").csv({ typed: true });
const stack2 = FileAttachment("../data/area/stack2.csv").csv({ typed: true });
const unemploy = FileAttachment("../data/area/unemployment.csv").csv({
  typed: true,
});
const traffic = FileAttachment("../data/area/traffic.csv").csv({ typed: true });
const temperature = FileAttachment("../data/area/sfo-temperature.csv").csv({
  typed: true,
});

// Input.chec
```

<div class="areacharts">
	<div class="card">
		${areaChart(aapl)()}
	</div>
	<div class="card">
		${area2Chart(aapl)()}
	</div>
	<div class="card">
		${stackArea(unemploy)()}
	</div>
	<div class="card">
		${stackNormal(unemploy)()}
	</div>
	<div class="card">
		${streamArea(unemploy)()}
	</div>
	<div class="card">
		${ridgeLine(traffic).size([700,800])()}
	</div>
	<div class="card">
		${radialArea(temperature)()}
	</div>
</div>

<style>
		.areacharts{
			font-family: sans-serif;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
		}
		.card{
			margin-right: 1em;
			height: fit-content;
		}
#tooltip{
	position: absolute;
			top:0;
			left:0;
			padding: .5em;
			border: 2px solid #888;
			border-radius: 4px;
			background: whitesmoke;
			width: fit-content;
			height: fit-content;
}

</style>
