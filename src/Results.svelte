<script>
import {topic_data, look_up} from './store';
import { derived } from 'svelte/store';

const voter_ranking = derived([topic_data, look_up], 
	([$topic_data, $look_up]) => {
		if ($topic_data.result && $look_up){
			let ranking = Object.entries($topic_data.result.influence)
				.sort((a,b)=>a[1]<b[1])
				.map((v)=>{return [$look_up[v[0]], v[1]]})
				.reduce((out, cur)=>{
					return `${out}<li>${cur[0]} (${cur[1]})</li>`
				}, '');
			return `<ol>${ranking}</ol>`;
		} else {
			return 'loading...'
		}
	});

const plan_ranking = derived([topic_data, look_up], 
	([$topic_data, $look_up]) => {
		if ($topic_data.result && $look_up){
			let ranking = Object.entries($topic_data.result.votes)
				.sort((a,b)=>a[1]<b[1])
				.reduce((out, cur)=>{
					return `${out}<li>${cur[0]} (${cur[1].toFixed(2)})</li>`
				},'');
			return `<ol>${ranking}</ol>`

		} else {
			return 'loading...'
		}
	});
</script>

<style>
div#results{
	width:700px;
}
div#participants {
	width: 50%;
	float: left;
}
div#plans {
	width: 50%;
	float: right;
}
</style>

<div id="results">
	<h3>Results</h3>
	<div id="participants">
	<h4>participants:</h4>
		{@html $voter_ranking}
	</div>

	<div id="plans">
	<h4>plans:</h4>
		{@html $plan_ranking}
	</div>
</div>




