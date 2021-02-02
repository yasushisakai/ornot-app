<script>
import {influence_ranking, plan_ranking, api_prefix} from './store';

let comment = '';

async function top(uids){
	let array = await fetch(`${api_prefix}/users`,{
		method: "POST",
		body: JSON.stringify(uids),
		headers: {"Content-Type":"application/json"}
	}).then(x=>x.json());

	console.log(array);

	comment = '(';
	array.map(user=>{
		comment += `#${user[0].substring(0,6)} is ${user[1]}. `
	})
	comment += ')';
}

$: {
	if($influence_ranking.length > 0) {
		if($influence_ranking.length > 1){
			top([$influence_ranking[0][0],$influence_ranking[1][0]])
		} else {
			top([$influence_ranking[0][0]])
		}	
	}
}

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

span.user-tag{
	color: #999;
}

</style>

<div id="results">
	<h3>Results</h3>
	<div id="participants">
	<h4>participants:</h4>
		<ol>
	{#each $influence_ranking as person}
		<li><span class="user-tag">#{person[0].substring(0,6)}</span>: {person[1].toFixed(2)}</li>
	{/each}
	</ol>
	<p>
	{@html comment}
	</p>
	</div>

	<div id="plans">
	<h4>plans:</h4>
	<ol>
	{#each $plan_ranking as plan}
		<li>{plan[0]}: {plan[1].toFixed(2)}</li>		
	{/each}
	</ol>
	</div>
</div>




